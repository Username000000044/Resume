
import { useContext, type ReactNode } from "react";
import { Mode } from "@resume/frontend/src/store/useResumeConfigStore";
import { FieldType } from "@resume/frontend/src/types/trpc";
import { Separator, separatorMap } from "../constants";
import { ConfigChangeContext } from "../context/ConfigChangeContext";
import { TooltipScrubber } from "./ui/tooltip-scrubber";
import { GROUP_GAP_SCRUBBER } from "@/limits";

interface LiveGroupProps {
    field: FieldType;
    value: string;
    mode: Mode;
    showSeparator: boolean;
    groupGap: number;
    defaultGroupGap: number;
    separator: Separator;
    children: ReactNode;
}

export const ResumeGroupWrapper = ({
    field,
    value,
    mode,
    separator,
    groupGap,
    defaultGroupGap,
    children,
    showSeparator
}: LiveGroupProps) => {
    if (!value || value.trim() === "") return null;

    if (!field.group) return <>{children}</>;

    const updateProperty = useContext(ConfigChangeContext);

    const handleGapChange = (value: number) => {
        updateProperty(["template", "spacing", "group_gap"], value);
    };

    const handleGapReset = () => {
        updateProperty(["template", "spacing", "group_gap"], defaultGroupGap);
    };

    return (
        <span key={field.id} className="inline-flex items-center">
            {children}

            {/* View Mode */}
            {mode === "preview" && showSeparator && (
                <span className="px-(--group-gap) text-(--separator-color)">
                    {separatorMap[separator]}
                </span>
            )}

            {/* Live Mode */}
            {mode === "editor" && showSeparator && (
                <div
                    className="rounded-md hover:bg-destructive/12 transition-color duration-200"
                >
                    <TooltipScrubber
                        trigger={<span className="px-(--group-gap) text-(--separator-color)">{separatorMap[separator]}</span>}
                        scrollDirection="horizontal"
                        value={groupGap ?? 0}
                        onChange={handleGapChange}
                        onDoubleClick={handleGapReset}
                        step={GROUP_GAP_SCRUBBER.STEP}
                        min={GROUP_GAP_SCRUBBER.MIN}
                        max={GROUP_GAP_SCRUBBER.MAX}
                    />
                </div>

            )}
        </span>
    );
};
