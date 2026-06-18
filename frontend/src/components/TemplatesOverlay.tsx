import { useState, type ReactElement } from "react";
import { useMediaQuery } from "#/hooks/useMediaQuery";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "#/utils/trpc";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { TemplatesOverlayGallery } from "./TemplatesOverlayGallery";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Shredder } from "lucide-react";
import { TemplatesOverlaySelection } from "./TemplatesOverlaySelection";
import { useStore } from "zustand";
import { useSelectedTemplateStore } from "#/store/templatesStore";

export const TemplatesOverlay = ({ trigger }: { trigger: ReactElement }) => {
  const { data } = useQuery(trpc.templatesList.queryOptions());

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)"); // Tailwind lg media query

  const selectedTemplate = useStore(
    useSelectedTemplateStore,
    (state) => state.selectedTemplate,
  );

  if (!data) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={trigger} />
        <DialogContent>
          <Empty className="h-full bg-muted">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Shredder />
              </EmptyMedia>
              <EmptyTitle>No Templates</EmptyTitle>
              <EmptyDescription className="max-w-xs">
                We&apos;re out of stock. Don&apos;t worry, we&apos;ve already
                put in another order.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </DialogContent>
      </Dialog>
    );
  }

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={trigger} />
        <DialogContent
          showCloseButton={false}
          className="bg-transparent shadow-none p-0 ring-0 flex min-w-2/3"
        >
          <div className="bg-popover p-12 w-full rounded-l-4xl shadow-md">
            <h2 className="text-5xl font-bold text-primary">Select Template</h2>
            <TemplatesOverlayGallery data={data} />
          </div>

          {/* Sidebar Only Appears if Template is Clicked */}
          <TemplatesOverlaySelection />
        </DialogContent>
      </Dialog>
    );

  // return (
  //   <TemplatesOverlayMobile />
  // );
};
