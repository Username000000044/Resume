import { cn } from "@/lib/utils";
import { ConfigData } from "@/ResumeRenderEngine";
import { Mode } from "@resume/frontend/src/store/useResumeConfigStore";

interface DividerProps {
    mode: Mode;
    dividerStyle: ConfigData["template"]["decorations"]["divider_style"];
    defaultDividerGap: number;
}

export const ResumeDivider = ({ mode, dividerStyle, defaultDividerGap }: DividerProps) => {

    return (
        <div className="relative">
            {mode === "editor" && (
                <div className="absolute -top-[calc(var(--divider-gap)/2)] -translate-y-1/2 w-full">
                    {/* <BarScrubberItem
                        defaultValue={defaultDividerGap}
                        path={["templateConfig", "spacing", "divider_gap"]}
                        config={{ max: 20, min: 0, step: 1 }}
                    /> */}
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
