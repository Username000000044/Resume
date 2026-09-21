import { cn } from "#/lib/utils";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import type { TemplateConfig } from "#/types/Template";
import { useShallow } from "zustand/react/shallow";
import { BarScrubberItem } from "./BarScrubberItem";

interface DividerItemProps {
  template_config: TemplateConfig;
}

export const DividerItem = ({ template_config }: DividerItemProps) => {
  const { liveMode, defaultDividerGap } = useResumeConfigStore(
    useShallow((store) => ({
      liveMode: store.liveMode,
      defaultDividerGap: store.defaultConfig.template.spacing.divider_gap,
    })),
  );
  const dividerStyle = template_config.decorations.divider_style;

  return (
    <div className="relative">
      {liveMode === "config" && (
        <div className="absolute -top-[calc(var(--divider-gap)/2)] -translate-y-1/2 w-full">
          <BarScrubberItem
            defaultValue={defaultDividerGap}
            path={["templateConfig", "spacing", "divider_gap"]}
            config={{ max: 20, min: 0, step: 1 }}
          />
        </div>
      )}
      <hr
        className={cn("border-[var(--divider-color)] my-[var(--divider-gap)]", {
          "border-solid": dividerStyle === "solid",
          "border-dashed": dividerStyle === "dashed",
          "border-solid border-[1.2pt]": dividerStyle === "thick",
        })}
      />
    </div>
  );
};
