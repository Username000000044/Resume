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
    const { updateProperty, getProperty } = useResumeConfigStore(
        useShallow((state) => ({
            updateProperty: state.updateProperty,
            getProperty: state.getProperty,
        })),
    );

    const value = getProperty<number>(path);

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
