import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../backend/src/appRouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import _ from "lodash";
import { useTemplateStore } from "#/store/templatesStore";

const TWEEN_FACTOR_BASE = 0.3;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

interface CarouselProps {
  data: inferRouterOutputs<AppRouter>["templatesList"];
}

export const TemplatesCarousel = ({ data }: CarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setSelectedTemplate = useTemplateStore(
    (state) => state.setSelectedTemplate,
  );

  useEffect(() => {
    if (!api) {
      return;
    }
  });

  const setTweenNodes = useCallback(
    (emblaApi: NonNullable<CarouselApi>): void => {
      tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
        return slideNode.querySelector("[data-tween-target]") as HTMLElement;
      });
    },
    [],
  );

  const setTweenFactor = useCallback((emblaApi: NonNullable<CarouselApi>) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenTransform = useCallback(
    (emblaApi: NonNullable<CarouselApi>, event?: any) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = event?.type === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex] || [];

        slidesInSnap.forEach((slideIndex, idx) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const scale = numberWithinRange(tweenValue, 0, 1).toString();
          const tweenNode = tweenNodes.current[slideIndex];
          tweenNode.style.transform = `scale(${scale})`;
        });
      });
    },
    [],
  );

  const throttledSelect = useMemo(() => {
    return _.throttle((index: number, templateData: typeof data) => {
      const currentTemplate = templateData[index];
      if (currentTemplate) {
        setSelectedTemplate(currentTemplate);
      }
    }, 200);
  }, [setSelectedTemplate]);

  const updateSelectedTemplate = useCallback(
    (emblaApi: NonNullable<CarouselApi>) => {
      const currentIndex = emblaApi.selectedScrollSnap();
      throttledSelect(currentIndex, data);
    },
    [throttledSelect, data],
  );

  useEffect(() => {
    if (!api) return;

    setTweenNodes(api);
    setTweenFactor(api);

    updateSelectedTemplate(api);

    api
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)

      .on("reInit", tweenTransform)
      .on("scroll", tweenTransform)
      .on("slideFocus", tweenTransform)
      .on("slidesInView", tweenTransform)

      .on("select", updateSelectedTemplate);
  }, [
    api,
    setTweenFactor,
    setTweenNodes,
    tweenTransform,
    updateSelectedTemplate,
  ]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      plugins={[WheelGesturesPlugin({ forceWheelAxis: "y" })]}
      className="w-full max-w-[40rem] mx-auto"
    >
      <CarouselContent className="-ml-2">
        {data.map((template) => {
          return (
            <CarouselItem key={template.id} className="relative pl-2 basis-1/2">
              <img
                data-tween-target
                className="will-change-transform aspect-[8/11] w-full shadow-md border-2 border-primary"
                src={template.thumbnail}
                alt="Template Thumbnail"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};
