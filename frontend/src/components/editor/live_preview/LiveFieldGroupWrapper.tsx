import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import type { FieldType } from "#/types/Template";
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


//     <Tooltip
//       open={isOpen}
//       onOpenChange={(nextOpen, event) => {
//         if (!nextOpen && event.reason === "trigger-press") {
//           setIsOpen(nextOpen);
//           return;
//         }

//         setIsOpen(nextOpen);
//       }}
//     >
//       <TooltipTrigger>
//         {/** biome-ignore lint/a11y/noStaticElementInteractions: other sematic elements dont work (TODO: FIX) */}
//         <span
//           className="px-[var(--group-gap)] cursor-col-resize text-muted-foreground hover:text-foreground transition-colors"
//           onClick={(e) => {
//             e.preventDefault();
//             setIsOpen(true);
//           }}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" || e.key === "") {
//               e.preventDefault();
//               setIsOpen(true);
//             }
//           }}
//         >
//           {seperatorMap[separator]}
//         </span>
//       </TooltipTrigger>

//       {/* TooltipContent accepts standard shadcn animation/color styling parameters */}
//       <TooltipContent side="top" align="center" sideOffset={-2}>
//         {groupGap}pt
//       </TooltipContent>
//     </Tooltip>