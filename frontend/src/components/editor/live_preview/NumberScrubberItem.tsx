import { useShallow } from "zustand/react/shallow";
import {
  useResumeConfigStore,
  type ValueType,
} from "#/store/useResumeConfigStore";
import { NumericScrubber } from "#/components/ui/number-scrubber";
import type { ConfigValue } from "#/types/TemplateConfig";

interface ScrubberInputProps {
  defaultValue: number;
  path: string[];
  config: {
    step: number;
    min: number;
    max: number;
  };
}

export const NumberScrubberItem = ({
  defaultValue,
  path,
  config: { step, min, max },
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
    <NumericScrubber
      variant="destructive"
      value={value ?? 0}
      onChange={handleChange}
      onDoubleClick={handleReset}
      step={step}
      min={min}
      max={max}
    />
  );
};
