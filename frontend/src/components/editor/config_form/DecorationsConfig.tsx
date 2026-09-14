import { Field, FieldLabel } from "#/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Switch } from "#/components/ui/switch";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { BULLET_STYLE, DIVIDER_STYLE } from "@resume/backend/src/db/schema.js";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { NumberScrubberItem } from "./NumberScrubberItem";
import { Label } from "#/components/ui/label";

interface Item {
  label: string;
  value: string;
}

const dividerItems: Item[] = DIVIDER_STYLE.map((style) => ({
  label: style.replace(/\b\w/g, (char) => char.toUpperCase()),
  value: style,
}));

const bulletItems: Item[] = BULLET_STYLE.map((style) => ({
  label: style.replace(/\b\w/g, (char) => char.toUpperCase()),
  value: style,
}));

export const DecorationsConfig = () => {
  const { config, defaultConfig, updateProperty } = useResumeConfigStore(
    useShallow((store) => ({
      config: store.config,
      defaultConfig: store.defaultConfig,
      updateProperty: store.updateProperty,
    })),
  );

  const [selectedDividerStyle, setSlectedDividerStyle] = useState(
    config.templateConfig.decorations.divider_style,
  );
  const [selectedBulletStyle, setSlectedBulletStyle] = useState(
    config.templateConfig.decorations.bullet_style,
  );
  const [selectedSubBulletStyle, setSubSlectedBulletStyle] = useState(
    config.templateConfig.decorations.sub_bullet_style,
  );
  const [isHeaderDividerVisible, setIsHeaderDividerVisible] = useState(
    config.templateConfig.decorations.header_divider,
  );
  const [isSectionDividerVisible, setIsSectionDividerVisible] = useState(
    config.templateConfig.decorations.section_divider,
  );

  const defualtBulletIndentation =
    defaultConfig.template.spacing.bullet_indentation;

  return (
    <>
      {/* Divider Config */}
      <p className="col-span-2 text-xs font-extralight">DIVIDERS</p>

      <Field className="gap-0">
        <FieldLabel className="font-normal">Divider Style</FieldLabel>
        <Select
          items={dividerItems}
          value={selectedDividerStyle}
          onValueChange={(value) => {
            if (!value) return;

            setSlectedDividerStyle(value);
            updateProperty(
              ["templateConfig", "decorations", "divider_style"],
              value,
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {dividerItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <div className="flex flex-col items-center justify-end gap-1">
        <div className="flex items-center space-x-2">
          <Label className="font-normal">Header</Label>
          <Switch
            className="cursor-pointer"
            size="sm"
            onCheckedChange={(checked) => {
              updateProperty(
                ["templateConfig", "decorations", "header_divider"],
                checked,
              );
              setIsHeaderDividerVisible(checked);
            }}
            checked={isHeaderDividerVisible}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label className="font-normal">Sections</Label>
          <Switch
            className="cursor-pointer"
            size="sm"
            onCheckedChange={(checked) => {
              updateProperty(
                ["templateConfig", "decorations", "section_divider"],
                checked,
              );
              setIsSectionDividerVisible(checked);
            }}
            checked={isSectionDividerVisible}
          />
        </div>
      </div>

      {/* Bullet Config */}
      <p className="col-span-2 text-xs font-extralight mt-2">BULLETS</p>
      <Field className="gap-0">
        <FieldLabel className="font-normal">Bullet Style</FieldLabel>
        <Select
          items={bulletItems}
          value={selectedBulletStyle}
          onValueChange={(value) => {
            if (!value) return;

            setSlectedBulletStyle(value);
            updateProperty(
              ["templateConfig", "decorations", "bullet_style"],
              value,
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {bulletItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field className="gap-0">
        <FieldLabel className="font-normal">Sub Bullet Style</FieldLabel>
        <Select
          items={bulletItems}
          value={selectedSubBulletStyle}
          onValueChange={(value) => {
            if (!value) return;

            setSubSlectedBulletStyle(value);
            updateProperty(
              ["templateConfig", "decorations", "sub_bullet_style"],
              value,
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {bulletItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field className="col-span-2 gap-0">
        <FieldLabel className="font-normal">Indentation</FieldLabel>
        <NumberScrubberItem
          path={["templateConfig", "spacing", "bullet_indentation"]}
          config={{ step: 1, min: 0, max: 50 }}
          defaultValue={defualtBulletIndentation}
        />
      </Field>
    </>
  );
};
