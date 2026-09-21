import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import type { FieldType } from "#/types/Template";
import { useState, type ReactNode } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const { groupGap, liveMode } = useResumeConfigStore(
    useShallow((store) => ({
      liveMode: store.liveMode,
      groupGap: store.config.templateConfig.spacing.group_gap,
    })),
  );

  if (!value) return;

  const group = field.group;
  if (!group || group.separator === "none") return <>{children}</>;

  const isNotLastFieldInGroup =
    group.fields.length - 1 !== (field.alignment?.itemOrder ?? 0);

  return (
    <span key={field.id} className="inline-flex items-center">
      {children}

      {/* View Mode */}
      {liveMode === "view" && isNotLastFieldInGroup && (
        <span className="px-[var(--group-gap)] text-muted-foreground hover:text-foreground transition-colors">
          {seperatorMap[group.separator]}
        </span>
      )}

      {/* Live Mode */}
      {liveMode === "config" && isNotLastFieldInGroup && (
        <Tooltip
          open={isOpen}
          onOpenChange={(nextOpen, event) => {
            if (!nextOpen && event.reason === "trigger-press") {
              setIsOpen(nextOpen);
              return;
            }

            setIsOpen(nextOpen);
          }}
        >
          <TooltipTrigger>
            {/** biome-ignore lint/a11y/noStaticElementInteractions: other sematic elements dont work (TODO: FIX) */}
            <span
              className="px-[var(--group-gap)] cursor-col-resize text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "") {
                  e.preventDefault();
                  setIsOpen(true);
                }
              }}
            >
              {seperatorMap[group.separator]}
            </span>
          </TooltipTrigger>

          {/* TooltipContent accepts standard shadcn animation/color styling parameters */}
          <TooltipContent side="top" align="center" sideOffset={-2}>
            {groupGap}pt
          </TooltipContent>
        </Tooltip>
      )}
    </span>
  );
};
