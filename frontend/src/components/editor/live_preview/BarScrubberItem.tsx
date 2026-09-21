import { useShallow } from "zustand/react/shallow";
import {
  useResumeConfigStore,
  type ValueType,
} from "#/store/useResumeConfigStore";
import { BarScrubber } from "#/components/ui/bar-scrubber";

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
    <BarScrubber
      value={value ?? 0}
      onChange={handleChange}
      onDoubleClick={handleReset}
      step={step}
      min={min}
      max={max}
      className={className}
    />
  );
};
