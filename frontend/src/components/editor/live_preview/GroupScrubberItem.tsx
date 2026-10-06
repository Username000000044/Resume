import { useShallow } from "zustand/react/shallow";
import {
    useResumeConfigStore,
} from "#/store/useResumeConfigStore";
import { TooltipScrubber } from "#/components/ui/tooltip-scrubber";
import type { ReactNode } from "react";

interface ScrubberInputProps {
    trigger: ReactNode;
    defaultValue: number;
    path: string[];
    config: {
        step: number;
        min: number;
        max: number;
    };
    className?: string;
}

export const GroupScrubberItem = ({
    trigger,
    defaultValue,
    path,
    config: { step, min, max },
    className,
}: ScrubberInputProps) => {
    const updateProperty = useResumeConfigStore((state) => state.updateProperty);

    const value = useResumeConfigStore((state) => {
        let target = state.config as any;
        for (let i = 0; i < path.length; i++) {
            if (target == null) return defaultValue;
            target = target[path[i]];
        }
        return (target ?? defaultValue) as number;
    });

    const handleChange = (value: number) => {
        updateProperty(path, value);
    };

    const handleReset = () => {
        updateProperty(path, defaultValue);
    };

    return (
        <div
            className="w-[var(--group-gap] rounded-md hover:bg-destructive/12 transition-color duration-200"
        >
            <TooltipScrubber
                trigger={trigger}
                scrollDirection="horizontal"
                value={value ?? 0}
                onChange={handleChange}
                onDoubleClick={handleReset}
                step={step}
                min={min}
                max={max}
                className={className}
            />
        </div>
    );
};
