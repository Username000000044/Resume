import { useShallow } from "zustand/react/shallow";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import {
  NumericScrubber,
  type IconOrientation,
} from "#/components/ui/number-scrubber";

interface ScrubberInputProps {
  defaultValue: number;
  path: string[];
  config: {
    step: number;
    min: number;
    max: number;
  };
}

interface HasIconProps extends ScrubberInputProps {
  hasIcon: true;
  iconOrientation: IconOrientation;
}
interface NoIconProps extends ScrubberInputProps {
  hasIcon?: false;
  iconOrientation?: never;
}

export const NumberScrubberInputItem = (props: HasIconProps | NoIconProps) => {
  const { defaultValue, path, config } = props;
  const { step, min, max } = config;

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
      variant="styled"
      scrollDirection="horizontal"
      value={value ?? 0}
      onChange={handleChange}
      onDoubleClick={handleReset}
      step={step}
      min={min}
      max={max}
      {...(props.hasIcon
        ? { hasIcon: true, iconOrientation: props.iconOrientation }
        : { hasIcon: false })}
    />
  );
};
