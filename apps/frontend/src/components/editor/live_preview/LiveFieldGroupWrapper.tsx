import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import type { FieldType } from "#/types/template";
import { useState, type ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import { GroupScrubberItem } from "./GroupScrubberItem";

interface LiveGroupProps {
  field: FieldType;
  value: string;
  children: ReactNode;
  showSeparator: boolean;
}

const seperatorMap = {
  dot: "·",
  bullet: "•",
  pipe: "|",
  comma: ",",
  slash: "/",
  none: " ",
};

export const LiveFieldGroupWrapper = ({
  field,
  value,
  children,
  showSeparator
}: LiveGroupProps) => {
  const { separator, defaultGroupGap, liveMode } = useResumeConfigStore(
    useShallow((store) => ({
      separator: store.config.templateConfig.decorations.group_separator,
      defaultGroupGap: store.defaultConfig.template.spacing.group_gap,
      liveMode: store.liveMode,
    })),
  );

  if (!value || value.trim() === "") return null;

  if (!field.group) return <>{children}</>;

  return (
    <span key={field.id} className="inline-flex items-center">
      {children}

      {/* View Mode */}
      {liveMode === "view" && showSeparator && (
        <span className="px-[var(--group-gap)] text-[var(--separator-color)]">
          {seperatorMap[separator]}
        </span>
      )}

      {/* Live Mode */}
      {liveMode === "config" && showSeparator && (
        <GroupScrubberItem
          trigger={<span className="px-[var(--group-gap)] text-[var(--separator-color)]">{seperatorMap[separator]}</span>}
          config={{ max: 15, min: 0, step: 1 }}
          defaultValue={defaultGroupGap}
          path={["templateConfig", "spacing", "group_gap"]}
        />

      )}
    </span>
  );
};