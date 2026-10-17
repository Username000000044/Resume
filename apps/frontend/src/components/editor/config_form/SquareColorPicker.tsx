import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { useMemo, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Avatar, AvatarGroup } from "#/components/ui/avatar";
import { Field } from "#/components/ui/field";
import { cn } from "#/lib/utils";

export interface ColorPickerProps {
  inputColor: string;
  defaultColor: string;
  handleColorChange: (newColor: string) => void;
  className?: string
}

export const SquareColorPicker = ({ className, inputColor, defaultColor, handleColorChange }: ColorPickerProps) => {
  const colors = useResumeConfigStore((store) => store.config.templateConfig.theme.colors,);

  const uninqueColors = useMemo(() => {
    return [...new Set(Object.values(colors))];
  }, [colors]);

  const [color, setColor] = useState(inputColor);

  const handleLocalColorChange = (newColor: string) => {
    handleColorChange(newColor);
    setColor(newColor);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn("size-8 rounded-2xl ring-3 ring-input/20 shadow-md cursor-pointer", className)}
            style={
              {
                background: inputColor,
              } as React.CSSProperties
            }
          />
        }
      />
      <PopoverContent className="w-min">
        <HexColorPicker
          color={color}
          onChange={setColor}
          onChangeEnd={handleLocalColorChange}
        />
        <Field className="gap-0">
          <HexColorInput
            prefixed={true}
            color={color}
            onChange={handleLocalColorChange}
            onDoubleClick={() => handleLocalColorChange(defaultColor)}
            className="h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-base transition-[color,box-shadow] duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
          />
        </Field>

        <AvatarGroup className="flex flex-wrap gap-1 justify-center">
          {uninqueColors.map((color) => (
            <Avatar
              key={color}
              className="after:border-0 bg-[var(--avatar-color)]"
              onClick={() => handleLocalColorChange(color)}
              style={
                {
                  "--avatar-color": color,
                } as React.CSSProperties
              }
            />
          ))}
        </AvatarGroup>
      </PopoverContent>
    </Popover>
  );
};
