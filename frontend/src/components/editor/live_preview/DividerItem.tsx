import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../../backend/src/appRouter";
import { cn } from "#/lib/utils";

type TemplateType = inferRouterOutputs<AppRouter>["templateById"];

interface DividerItemProps {
  templateData: TemplateType;
}

export const DividerItem = ({ templateData }: DividerItemProps) => {
  const dividerStyle = templateData.default_config.decorations.divider_style;

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
