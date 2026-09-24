import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import type { FieldType } from "#/types/Template";
import { useEffect, useMemo, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useShallow } from "zustand/react/shallow";
import { ConfigCardItem } from "./ConfigCardItem";
import { Card, CardContent } from "#/components/ui/card";
import { Avatar, AvatarFallback, AvatarGroup } from "#/components/ui/avatar";
import { Field, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";

type FieldRole = FieldType["renderRole"];
interface ColorPickerProps {
  fieldRole: FieldRole;
}

export const FieldColorPicker = ({ fieldRole }: ColorPickerProps) => {
  const { colors, defaultColors, updateProperty } = useResumeConfigStore(
    useShallow((store) => ({
      colors: store.config.templateConfig.theme.colors,
      defaultColors: store.defaultConfig.template.theme.colors,
      updateProperty: store.updateProperty,
    })),
  );

  const uninqueColors = useMemo(() => {
    return [...new Set(Object.values(colors))];
  }, [colors]);

  const fieldColor = colors[fieldRole];
  const defaultColor = defaultColors[fieldRole];
  const [color, setColor] = useState(fieldColor);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    updateProperty(["templateConfig", "theme", "colors", fieldRole], newColor);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="size-8 rounded-md ring-3 ring-input/20 shadow-md cursor-pointer"
            style={
              {
                background: fieldColor,
              } as React.CSSProperties
            }
          />
        }
      />
      <PopoverContent className="w-min">
        <HexColorPicker
          color={color}
          onChange={setColor}
          onChangeEnd={handleColorChange}
        />
        <Field className="gap-0">
          <HexColorInput
            prefixed={true}
            color={color}
            onChange={handleColorChange}
            onDoubleClick={() => handleColorChange(defaultColor)}
            className="h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-base transition-[color,box-shadow] duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
          />
        </Field>

        <AvatarGroup className="flex flex-wrap gap-1 justify-center">
          {uninqueColors.map((color) => (
            <Avatar
              key={color}
              className="after:border-0 bg-[var(--avatar-color)]"
              onClick={() => handleColorChange(color)}
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
