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
import { FONT_VARIANTS } from "@resume/backend/src/db/schema.js";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { FieldType } from "#/types/Template";
import { useShallow } from "zustand/react/shallow";
import { NumberScrubberItem } from "./NumberScrubberItem";

interface Item {
  label: string;
  value: string;
}

const variants: Item[] = FONT_VARIANTS.map((variant) => ({
  label: variant.charAt(0).toUpperCase() + variant.slice(1),
  value: variant,
}));

interface FieldConfigProps {
  fieldRole: FieldType["renderRole"];
}

export const FieldConfig = ({ fieldRole }: FieldConfigProps) => {
  const { config, defaultConfig, updateProperty } = useResumeConfigStore(
    useShallow((store) => ({
      config: store.config,
      updateProperty: store.updateProperty,
      defaultConfig: store.defaultConfig,
    })),
  );

  const fontVariant =
    config.templateConfig.theme.typography.font_family[fieldRole];
  const defaultFontWeight =
    defaultConfig.template.theme.typography.font_weight[fieldRole];

  const [selectedFontVariant, setSelectedFontVariant] = useState(fontVariant);

  return (
    <>
      <Field className="gap-0">
        <FieldLabel className="font-normal">Primary Font</FieldLabel>
        <Select
          items={variants}
          value={selectedFontVariant}
          onValueChange={(value) => {
            if (!value) return;

            setSelectedFontVariant(value);
            updateProperty(
              [
                "templateConfig",
                "theme",
                "typography",
                "font_family",
                fieldRole,
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
              {variants.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field className="gap-0">
        <FieldLabel className="font-normal">Font Weight</FieldLabel>
        <NumberScrubberItem
          path={[
            "templateConfig",
            "theme",
            "typography",
            "font_weight",
            fieldRole,
          ]}
          config={{ step: 100, min: 100, max: 900 }}
          defaultValue={defaultFontWeight}
        />
      </Field>
    </>
  );
};
