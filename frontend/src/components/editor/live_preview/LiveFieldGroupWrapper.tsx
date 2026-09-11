import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import type { FieldType, TemplateType } from "#/types/Template";
import type { ReactNode } from "react";
import { NumberScrubberItem } from "./NumberScrubberItem";
import { useShallow } from "zustand/react/shallow";

interface LiveGroupProps {
  field: FieldType;
  value: string;
  children: ReactNode;
}

const seperatorMap = {
  dot: "·",
  bullet: "•",
  pipe: "|",
  comma: ",",
  slash: "/",
  none: "",
};

export const LiveFieldGroupWrapper = ({
  field,
  value,
  children,
}: LiveGroupProps) => {
  const { liveMode, defaultTemplateConfig } = useResumeConfigStore(
    useShallow((store) => ({
      liveMode: store.liveMode,
      defaultTemplateConfig: store.defaultTemplateConfig,
    })),
  );

  if (!value) return;

  const group = field.group;
  if (!group || group.separator === "none") return <>{children}</>;

  const defaultGroupGap = defaultTemplateConfig.spacing.group_gap;
  const itemOrder = field.alignment?.itemOrder;

  return (
    <span
      key={field.id}
      className="relative inline-flex items-center after:content-[attr(data-separator)] after:px-[var(--group-gap)] last:after:content-none first:[&]:"
      data-separator={seperatorMap[group.separator]}
    >
      {/* Config Mode */}
      {itemOrder === 0 && liveMode === "config" && (
        <div className="absolute -left-24">
          <NumberScrubberItem
            defaultValue={defaultGroupGap}
            path={["templateConfig", "spacing", "group_gap"]}
            config={{ step: 1, min: 0, max: 20 }}
          />
        </div>
      )}
      {children}
    </span>
  );
};
