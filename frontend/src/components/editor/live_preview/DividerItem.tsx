import { cn } from "#/lib/utils";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import type { TemplateConfig } from "#/types/Template";

interface DividerItemProps {
  template_config: TemplateConfig;
}

export const DividerItem = ({ template_config }: DividerItemProps) => {
  const liveMode = useResumeConfigStore((store) => store.liveMode);
  const dividerStyle = template_config.decorations.divider_style;

  return (
    <div className="relative">
      {/* {liveMode === "config" && (
        <span className="absolute -top-[var(--section-gap)] -translate-x-1/2 left-1/2 cursor-row-resize">
          ______________
        </span>
      )} */}
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
