import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { VariantProps } from "class-variance-authority";
import { MoveHorizontal, MoveVertical } from "lucide-react";

interface BaseScrubberProps extends Omit<
    React.HTMLAttributes<HTMLInputElement>,
    "onChange"
> {

    /**
     * Direction mouse scroll
     */
    scrollDirection: "vertical" | "horizontal";
    /**
     * Current numeric value
     */
    value: number;
    /**
     * Callback whenever the value changes
     */
    onChange: (value: number) => void;
    /**
     * Minimum allowable value (clamped)
     */
    min?: number;
    /**
     * Maximum allowable value (clamped)
     */
    max?: number;
    /**
     * Step for increments (e.g., 1, 0.1, etc.)
     */
    step?: number;
    /**
    * Bar dimensions multiplier
    */
    multiplier?: number;
    /**
     * Additional class names for the outer wrapper
     */
    className?: string;

    /**
     * Controls the number of pixels required to increase/decrease a step.
     * A value of 1.0 means 1 pixel per step; 0.1 means 10 pixels per step
     *
     * * For fine-grained control (like opacity: 0-1): use a small value like 0.001
     * * For medium control (like rotation: 0-360): use a medium value like 0.1
     * * For coarse control (like integer counts): use a larger value like 0.5
     */
    scrubSensitivity?: number;
}
export const BarScrubber = React.forwardRef<
    HTMLInputElement,
    BaseScrubberProps
>((props, ref) => {
    const {
        value,
        onChange,
        min = 0,
        max = 100,
        step = 1,
        className,
        scrubSensitivity = 0.5,
        scrollDirection,
        multiplier = 1,
        ...rest
    } = props;

    // Use a ref for values that change constantly to avoid breaking closure scopes
    const stateRef = React.useRef({
        value,
        min,
        max,
        step,
        scrubSensitivity,
        scrollDirection,
    });

    // Keep the ref up to date on every render without triggering re-renders
    React.useEffect(() => {
        stateRef.current = {
            value,
            min,
            max,
            step,
            scrubSensitivity,
            scrollDirection,
        };
    }, [value, min, max, step, scrubSensitivity, scrollDirection]);

    // Determine how many decimals to keep based on `step`
    const decimals = React.useMemo(() => {
        if (!Number.isFinite(step)) return 0;
        const stepString = step.toString();
        const decimalPart = stepString.split(".")[1];
        return decimalPart ? decimalPart.length : 0;
    }, [step]);

    /** Clamp and quantize helper */
    const clampAndQuantize = React.useCallback(
        (
            n: number,
            currentStep: number,
            currentMin: number,
            currentMax: number,
        ) => {
            const quantized = Math.round(n / currentStep) * currentStep;
            const clamped = Math.max(currentMin, Math.min(quantized, currentMax));
            return parseFloat(clamped.toFixed(decimals));
        },
        [decimals],
    );

    /** On pointer down: start dragging */
    function handlePointerDown(e: React.PointerEvent) {
        if (e.button !== 0) return; // Only left-click

        const { scrollDirection: dir, value: startVal } = stateRef.current;
        const initialPos = dir === "horizontal" ? e.clientX : e.clientY;

        e.currentTarget.setPointerCapture(e.pointerId);

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const {
                step: s,
                min: mn,
                max: mx,
                scrubSensitivity: sens,
                scrollDirection: currentDir,
            } = stateRef.current;

            let newValue: number;
            if (currentDir === "horizontal") {
                const deltaX = moveEvent.clientX - initialPos;
                newValue = startVal + deltaX * s * sens;
            } else {
                const deltaY = initialPos - moveEvent.clientY; // Up is positive
                newValue = startVal + deltaY * s * sens;
            }

            onChange(clampAndQuantize(newValue, s, mn, mx));
        };

        const handlePointerUp = (upEvent: PointerEvent) => {
            // Clean up listeners from document safely
            document.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerup", handlePointerUp);
        };

        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
    }

    /** Handlers for manual text inputs */
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputVal = e.target.value;
        if (inputVal === "") {
            onChange(min);
            return;
        }

        const parsed = parseFloat(inputVal);
        if (Number.isNaN(parsed)) {
            onChange(min);
            return;
        }

        onChange(clampAndQuantize(parsed, step, min, max));
    }

    // Choose styling depending on scroll orientation
    const cursorClass =
        scrollDirection === "horizontal"
            ? "hover:cursor-col-resize"
            : "hover:cursor-row-resize";


    const sharedClasses = cn(
        `
        [appearance:textfield] 
        [&::-webkit-inner-spin-button]:appearance-none 
        [&::-webkit-outer-spin-button]:appearance-none 
        active:cursor-none 
        focus:outline-none
        text-center
        focus:outline-none"

        w-full
        `,
        cursorClass,
        className,
    );

    return (

        <div
            className={cn("opacity-0 rounded-md bg-destructive/12 hover:opacity-100 transition-color duration-200 h-full", {
                "w-(--bar-value) h-full": scrollDirection === "horizontal",
                "h-(--bar-value) w-full": scrollDirection === "vertical"
            })}
            style={{
                "--bar-value": `${value * multiplier}pt`,
            } as React.CSSProperties}
        >
            <input
                ref={ref}
                type="number"
                className={sharedClasses}
                step={step}
                value={value}
                onChange={handleInputChange}
                onPointerDown={handlePointerDown}
                {...rest}
            />
        </div>

    );
});

BarScrubber.displayName = "BarScrubber";
