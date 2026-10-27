import { cn } from "@/lib/utils";
import { ConfigData } from "@/ResumeRenderEngine";
import { Mode } from "@resume/frontend/src/store/useResumeConfigStore";
import { BarScrubber } from "./ui/bar-scrubber";
import { DIVIDER_GAP_SCRUBBER } from "@/limits";
import { useContext } from "react";
import { ConfigChangeContext } from "@/context/ConfigChangeContext";

interface DividerProps {
    mode: Mode;
    dividerStyle: ConfigData["template"]["decorations"]["divider_style"];
    dividerGap: number;
    defaultDividerGap: number;
}

export const ResumeDivider = ({ mode, dividerGap, dividerStyle, defaultDividerGap }: DividerProps) => {

    const updateProperty = useContext(ConfigChangeContext);

    const handleGapChange = (value: number) => {
        updateProperty(["template", "spacing", "divider_gap"], value);
    };

    const handleGapReset = () => {
        updateProperty(["template", "spacing", "divider_gap"], defaultDividerGap);
    };


    return (
        <div className="relative">
            {mode === "editor" && (
                <div className="absolute -top-(--divider-gap/2) -translate-y-(--divider-gap) w-full h-full">
                    <BarScrubber
                        scrollDirection="vertical"
                        value={dividerGap ?? 0}
                        onChange={handleGapChange}
                        onDoubleClick={handleGapReset}
                        min={DIVIDER_GAP_SCRUBBER.MIN}
                        max={DIVIDER_GAP_SCRUBBER.MAX}
                        step={DIVIDER_GAP_SCRUBBER.STEP}
                        multiplier={2}
                    />
                </div>
            )}
            <hr
                className={cn("border-(--divider-color) my-(--divider-gap)", {
                    "border-solid": dividerStyle === "solid",
                    "border-dashed": dividerStyle === "dashed",
                    "border-solid border-[1.2pt]": dividerStyle === "thick",
                })}
            />
        </div>
    );
};
