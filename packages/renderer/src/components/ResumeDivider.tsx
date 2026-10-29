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
        <div className="relative py-(--divider-gap) block w-full">
            {mode === "editor" && (
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-full pointer-events-auto">
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
                </div>
            )}
            <hr
                className={cn("w-full border-(--divider-color) m-0 block", {
                    "border-solid": dividerStyle === "solid",
                    "border-dashed": dividerStyle === "dashed",
                    "border-solid border-[1.2pt]": dividerStyle === "thick",
                })}
            />
        </div>
    );
};
