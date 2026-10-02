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
import {
  BULLET_STYLE,
  DIVIDER_STYLE,
  GROUP_SEPARATOR,
} from "@resume/backend/src/db/schema.js";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Label } from "#/components/ui/label";
import { NumberScrubberInputItem } from "./NumberScrubberInputItem";
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";
import { ColorPickerField } from "./ColorPickerField";
import { Toggle } from "#/components/ui/toggle";
import { BookmarkIcon, Heading, Minus, Plus, Section } from "lucide-react";

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

const seperatorItems: Item[] = GROUP_SEPARATOR.map((separator) => ({
  label: separator.replace(/\b\w/g, (char) => char.toUpperCase()),
  value: separator,
}));

export const DecorationsConfig = () => {
  const { decorationsConfig, colorConfig, defaultColorConfig, defaultSpacingConfig, updateProperty } = useResumeConfigStore(
    useShallow((store) => ({
      decorationsConfig: store.config.templateConfig.decorations,
      colorConfig: store.config.templateConfig.theme.colors,
      defaultColorConfig: store.defaultConfig.template.theme.colors,
      defaultSpacingConfig: store.defaultConfig.template.spacing,
      updateProperty: store.updateProperty,
    })),
  );

  const [selectedDividerStyle, setSlectedDividerStyle] = useState(decorationsConfig.divider_style);
  const [selectedBulletStyle, setSlectedBulletStyle] = useState(decorationsConfig.bullet_style);
  const [selectedSubBulletStyle, setSubSlectedBulletStyle] = useState(decorationsConfig.sub_bullet_style);
  const [isHeaderDividerVisible, setIsHeaderDividerVisible] = useState(decorationsConfig.header_divider);
  const [isSectionDividerVisible, setIsSectionDividerVisible] = useState(decorationsConfig.section_divider);
  const [selectedSeparator, setSelectedSeparator] = useState(decorationsConfig.group_separator);

  // Color Picker Field
  const handleColorChange = (newColor: string) => {
    updateProperty(["templateConfig", "theme", "colors", "divider"], newColor)
  }

  return (
    <>

      {/* <LocalSeparator value="GROUPS" /> */}

      {/* Group Config */}
      <Field className="gap-0 col-span-full">
        <FieldLabel className="font-normal">Group Seperator</FieldLabel>
        <Select
          items={seperatorItems}
          value={selectedSeparator}
          onValueChange={(value) => {
            if (!value) return;

            setSelectedSeparator(value);
            updateProperty(
              ["templateConfig", "decorations", "group_separator"],
              value,
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {seperatorItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <LocalSeparator value="BULLETS" />

      {/* Bullet Config */}
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

      <Field className="col-span-full gap-0">
        <FieldLabel className="font-normal">Indentation</FieldLabel>
        <NumberScrubberInputItem
          hasIcon={true}
          iconOrientation="horizontal"
          path={["templateConfig", "spacing", "bullet_indentation"]}
          config={{ step: 1, min: 0, max: 50 }}
          defaultValue={defaultSpacingConfig.bullet_indentation}
        />
      </Field>

      {/* Divider Separator */}
      <LocalSeparator value="DIVIDERS" />

      {/* Divider Config */}
      <ColorPickerField
        fieldLabel="Divider Color"
        inputColor={colorConfig.divider}
        defaultColor={defaultColorConfig.divider}
        handleColorChange={handleColorChange}
        className="absolute right-1 top-1/2 -translate-y-1/2 size-6 ring-0 rounded-lg " />

      <div className="flex items-end justify-end gap-1">
        {/* Header Toggle */}
        <Toggle
          className="aria-pressed:bg-input/50 font-normal cursor-pointer"
          aria-label="Toggle Header Divider"
          pressed={isHeaderDividerVisible}
          onPressedChange={(pressed) => {
            updateProperty(
              ["templateConfig", "decorations", "header_divider"],
              pressed,
            );
            setIsHeaderDividerVisible(pressed);
          }}

        >
          <Heading />
        </Toggle>


        {/* Sections Toggle */}
        <Toggle
          className="aria-pressed:bg-input/50 font-normal cursor-pointer"
          aria-label="Toggle Section Divider"
          pressed={isSectionDividerVisible}
          onPressedChange={(pressed) => {
            updateProperty(
              ["templateConfig", "decorations", "section_divider"],
              pressed,
            );
            setIsSectionDividerVisible(pressed);
          }}

        >
          <Section />
        </Toggle>
      </div >

      <Field className="gap-0 col-span-full">
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
    </>
  );
};

const LocalSeparator = ({ value, hasMargin = true }: { value: string, hasMargin?: boolean }) => {
  return (
    <div className={cn("flex items-center gap-2 col-span-full", {
      "mt-3": hasMargin
    })}>
      <Separator className="flex-1 bg-muted-foreground/10" />
      <p className="text-xs text-muted-foreground/20">{value}</p>
      <Separator className="flex-1 bg-muted-foreground/20" />
    </div>
  )
}