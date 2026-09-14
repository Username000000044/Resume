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
import { FONTS_LIST } from "@resume/backend/src/db/schema.ts";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { PRESET_MAP } from "../live_preview/LivePreview";
import { cn } from "cn";
import {
  useDynamicFontStack,
  type FontVariantConfig,
} from "#/hooks/useDynamicFontStack";
import { FONT_REGISTRY } from "#/utils/fontRegistery";

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
    config.templateConfig.theme.typography.primary_font_family,
  );
  const [selectedSecondaryFont, setSelectedSecondaryFont] = useState(
    config.templateConfig.theme.typography.secondary_font_family,
  );

  const roleWeight = config.templateConfig.theme.typography.font_weight;
  const allUniqueWeights = useMemo(() => {
    return new Set(Object.values(roleWeight));
  }, [roleWeight]);

  const primaryVariants = useMemo(
    () => getVariantsForFont(selectedPrimaryFont, allUniqueWeights),
    [selectedPrimaryFont, allUniqueWeights],
  );
  const secondaryVariants = useMemo(
    () => getVariantsForFont(selectedSecondaryFont, allUniqueWeights),
    [selectedSecondaryFont, allUniqueWeights],
  );

  const primaryStatus = useDynamicFontStack(
    selectedPrimaryFont,
    primaryVariants,
  );
  const secondaryStatus = useDynamicFontStack(
    selectedSecondaryFont,
    secondaryVariants,
  );

  type Preset = keyof typeof PRESET_MAP;
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
        "flex h-14 w-full cursor-pointer hover:bg-input select-none items-center justify-center whitespace-nowrap rounded-2xl bg-input/50 outline-none transition-all focus:border-ring focus:ring-3 focus:ring-ring/30",
        {
          "bg-input": config.templateConfig.theme.typography.preset === preset,
        },
      )}
      onClick={() =>
        updateProperty(
          ["templateConfig", "theme", "typography", "preset"],
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
      className="space-y-[var(--bar-gap)]"
      style={{ "--bar-gap": `${gap}px` } as React.CSSProperties}
    >
      <li className="w-[30px] h-[3px] bg-primary/50" />
      <li className="w-[20px] h-[3px] bg-primary/50" />
      <li className="w-[40px] h-[3px] bg-primary/50" />
    </ul>
  );

  return (
    <>
      <p className="col-span-2 text-xs font-extralight">TYPOGRAPHY</p>
      <Field className="gap-0">
        <FieldLabel className="font-normal">Primary Font</FieldLabel>
        <Select
          items={items}
          value={selectedPrimaryFont}
          disabled={primaryStatus === "loading"}
          onValueChange={(value) => {
            if (!value) return;

            setSelectedPrimaryFont(value);
            updateProperty(
              ["templateConfig", "theme", "typography", "primary_font_family"],
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

      <Field className="gap-0">
        <FieldLabel className="font-normal">Secondary Font</FieldLabel>
        <Select
          items={items}
          value={selectedSecondaryFont}
          disabled={secondaryStatus === "loading"}
          onValueChange={(value) => {
            if (!value) return;

            setSelectedSecondaryFont(value);
            updateProperty(
              [
                "templateConfig",
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

const getVariantsForFont = (
  fontName: string,
  uniqueWeights: Set<number>,
): FontVariantConfig[] => {
  const fontId = fontName.toLowerCase().replace(/\s+/g, "-");

  // Get the single loader file for this variable font
  const singleFontLoader = FONT_REGISTRY[fontId];
  if (!singleFontLoader) {
    console.warn(`Variable Font ID "${fontId}" not found in FONT_REGISTRY.`);
    return [];
  }

  // Assign the exact same file loader to every weight requested by the resume
  return Array.from(uniqueWeights).map((weight) => ({
    weight,
    loader: singleFontLoader, // Every weight points to the same asset package!
  }));
};
