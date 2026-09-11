import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  useResumeConfigStore,
  type UserConfigData,
} from "#/store/useResumeConfigStore";
import { NumericScrubber } from "#/components/ui/number-scrubber";
import type { TemplateConfig } from "#/types/Template";

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
  const { updateProperty, updateLiveProperty, liveConfig } =
    useResumeConfigStore(
      useShallow((state) => ({
        liveConfig: state.liveConfig,
        persistantConfig: state.persistantConfig,
        updateProperty: state.updateProperty,
        updateLiveProperty: state.updateLiveProperty,
      })),
    );

  const liveValue = getValue(liveConfig, path) ?? 0;

  const debouncedSave = useMemo(
    () =>
      debounce((value) => {
        updateProperty(path, value);
      }, 500), // 500ms debounce
    [path, updateProperty],
  );

  // Cleanup debouced fn if componet unmounts
  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  const handleChange = (value: number) => {
    updateLiveProperty(path, value); // Fast
    debouncedSave(value); // Waits for user to stop typing before saving
  };

  const handleReset = () => {
    updateLiveProperty(path, defaultValue);
  };

  return (
    <NumericScrubber
      variant="destructive"
      value={liveValue}
      onChange={handleChange}
      onDoubleClick={handleReset}
      onBlur={() => debouncedSave.flush()}
      step={step}
      min={min}
      max={max}
    />
  );
};

const getValue = (object: UserConfigData, path: string[]) => {
  let target: any = object;

  for (const key of path) {
    if (target === undefined || target === null) return undefined;
    target = target[key];
  }

  return target;
};
