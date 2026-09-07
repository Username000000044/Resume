import { cn } from "#/lib/utils";
import type { SectionConfig, TemplateConfig } from "#/types/Template";

interface DividerItemProps {
  template_config: TemplateConfig;
}

export const DividerItem = ({ template_config }: DividerItemProps) => {
  const dividerStyle = template_config.decorations.divider_style;

  return (
    <hr
      className={cn("border-[var(--divider-color)] my-[var(--divider-gap)]", {
        "border-solid": dividerStyle === "solid",
        "border-dashed": dividerStyle === "dashed",
        "border-solid border-[1.2pt]": dividerStyle === "thick",
      })}
    />
  );
};
