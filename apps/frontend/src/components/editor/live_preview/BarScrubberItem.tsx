import {
  useResumeConfigStore,
} from "#/store/useResumeConfigStore";
import { NumericScrubber } from "#/components/ui/number-scrubber";
import { cn } from "#/lib/utils";
import { useGetProperty } from "#/hooks/useGetProperty";

interface ScrubberInputProps {
  defaultValue: number;
  path: string[];
  config: {
    step: number;
    min: number;
    max: number;
  };
  className?: string;
}

export const BarScrubberItem = ({
  defaultValue,
  path,
  config: { step, min, max },
  className,
}: ScrubberInputProps) => {
  const updateProperty = useResumeConfigStore((state) => state.updateProperty);

  const value = useGetProperty<number>(path, defaultValue);

  const handleChange = (value: number) => {
    updateProperty(path, value);
  };

  const handleReset = () => {
    updateProperty(path, defaultValue);
  };

  return (
    <div
      className="flex items-center justify-center h-[var(--bar-height)] bg-destructive/12 rounded-md opacity-0 hover:opacity-100 transition-color duration-200"
      style={
        {
          "--bar-height": `${value}pt`,
        } as React.CSSProperties
      }
    >
      <NumericScrubber
        variant="default"
        scrollDirection="vertical"
        value={value ?? 0}
        onChange={handleChange}
        onDoubleClick={handleReset}
        step={step}
        min={min}
        max={max}
        className={cn(
          "m-0 p-0 h-5 w-full leading-none text-center focus:outline-none",
          className,
        )}
      />
    </div>
  );
};
