import { Field, FieldLabel } from "#/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "cn";
import type { scalePresetMap } from "@resume/renderer/constants";
import { FONTS_LIST } from "@resume/backend/src/db/constants.js";

interface Item {
  label: string;
  value: string;
}

const items: Item[] = FONTS_LIST.map((font) => ({
  label: font.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
  value: font,
}));

export const TypographyConfig = () => {
  const { config, updateProperty } = useResumeConfigStore(
    useShallow((store) => ({
      config: store.config,
      updateProperty: store.updateProperty,
    })),
  );

  const [selectedPrimaryFont, setSelectedPrimaryFont] = useState(
    config.template.theme.typography.primary_font_family,
  );
  const [selectedSecondaryFont, setSelectedSecondaryFont] = useState(
    config.template.theme.typography.secondary_font_family,
  );

  type Preset = keyof typeof scalePresetMap;
  const SpacingPresetElement = ({
    preset,
    gap,
  }: {
    preset: Preset;
    gap: number;
  }) => (
    <button
      type="button"
      className={cn(
        "flex h-14 w-full cursor-pointer hover:bg-muted select-none items-center justify-center whitespace-nowrap rounded-2xl outline-none transition-all focus:border-ring focus:ring-3 focus:ring-ring/30",
        {
          "bg-input/50 hover:bg-input/50": config.template.theme.typography.preset === preset,
        },
      )}
      onClick={() =>
        updateProperty(
          ["template", "theme", "typography", "preset"],
          preset,
        )
      }
    >
      <SpacedBarsIcon gap={gap} />
    </button>
  );
  const SpacedBarsIcon = ({ gap }: { gap: number }) => (
    <ul
      aria-hidden="true"
      className="space-y-(--bar-gap)"
      style={{ "--bar-gap": `${gap}px` } as React.CSSProperties}
    >
      <li className="w-7.5 h-0.75 bg-primary/50" />
      <li className="w-5 h-0.75 bg-primary/50" />
      <li className="w-10 h-0.75 bg-primary/50" />
    </ul>
  );

  return (
    <>
      <Field className="col-span-3 gap-0">
        <FieldLabel className="font-normal">Primary Font</FieldLabel>
        <Select
          items={items}
          value={selectedPrimaryFont}
          onValueChange={(value) => {
            if (!value) return;

            setSelectedPrimaryFont(value);
            updateProperty(
              ["template", "theme", "typography", "primary_font_family"],
              value,
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field className="col-span-3 gap-0">
        <FieldLabel className="font-normal">Secondary Font</FieldLabel>
        <Select
          items={items}
          value={selectedSecondaryFont}
          onValueChange={(value) => {
            if (!value) return;

            setSelectedSecondaryFont(value);
            updateProperty(
              [
                "template",
                "theme",
                "typography",
                "secondary_font_family",
              ],
              value,
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field className="col-span-full gap-0">
        <FieldLabel className="font-normal">Size Preset</FieldLabel>
        <div className="flex justify-between gap-4">
          <SpacingPresetElement preset="minimal" gap={3} />
          <SpacingPresetElement preset="balanced" gap={4} />
          <SpacingPresetElement preset="editorial" gap={7} />
        </div>
      </Field>
    </>
  );
};
