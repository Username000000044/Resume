import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import type { FieldType, TemplateType } from "#/types/Template";
import { useShallow } from "zustand/react/shallow";
import type { PRESET_MAP } from "./LivePreview";
import { useEffect, useState } from "react";
import { ConfigCardItem } from "../config_form/ConfigCardItem";
import { CardAction, CardTitle } from "#/components/ui/card";
import { FieldConfig } from "../config_form/FieldConfig";
import { SquareColorPicker } from "../config_form/SquareColorPicker";

type FieldRole = FieldType["renderRole"];
type FieldColor =
  TemplateType["default_config"]["theme"]["colors"][keyof TemplateType["default_config"]["theme"]["colors"]];
type FontWeight =
  TemplateType["default_config"]["theme"]["typography"]["font_weight"][keyof TemplateType["default_config"]["theme"]["typography"]["font_weight"]];

type FieldSize = number; //fix!!!!!!!!!!!!!!!!!!!!!!

type FieldHeight =
  (typeof PRESET_MAP)[TemplateType["default_config"]["theme"]["typography"]["preset"]]["line_height"][keyof (typeof PRESET_MAP)[TemplateType["default_config"]["theme"]["typography"]["preset"]]["line_height"]];

type FontVariant =
  TemplateType["default_config"]["theme"]["typography"]["font_family"][keyof TemplateType["default_config"]["theme"]["typography"]["font_family"]];

type FieldElement =
  TemplateType["default_config"]["elements"][keyof TemplateType["default_config"]["elements"]];

interface LiveFieldProps {
  value: string;
  properties: {
    fieldRole: FieldRole;
    fieldWeight: FontWeight;
    fieldColor: FieldColor;
    fieldSize: FieldSize;
    fieldHeight: FieldHeight;
    fontVariant: FontVariant;
    FieldElement: FieldElement;
  };
}

const elementNameMap: Record<FieldElement, string> = {
  h1: "Header",
  h2: "Title",
  h3: "Role",
  h4: "Entity",
  p: "Paragraph",
  span: "Metadata",
  li: "Bullet",
};

export const LiveFieldItem = ({ value, properties }: LiveFieldProps) => {
  const { typographyConfig, colors, defaultColors, liveMode, updateProperty } = useResumeConfigStore(
    useShallow((store) => ({
      colors: store.config.templateConfig.theme.colors,
      defaultColors: store.defaultConfig.template.theme.colors,
      typographyConfig: store.config.templateConfig.theme.typography,
      liveMode: store.liveMode,
      updateProperty: store.updateProperty,
    })),
  );

  const [isOpen, setIsOpen] = useState(false);

  const fieldColor = colors[properties.fieldRole];
  const defaultColor = defaultColors[properties.fieldRole];

  const handleColorChange = (newColor: string) => {
    updateProperty(["templateConfig", "theme", "colors", properties.fieldRole], newColor);
  };

  const fontFamily =
    properties.fontVariant === "primary"
      ? typographyConfig.primary_font_family
      : typographyConfig.secondary_font_family;

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (open && liveMode === "view") {
          return;
        }

        setIsOpen(open);
      }}
    >
      <PopoverTrigger
        render={
          <button
            type="button"
            className="select-text cursor-text [text-align:inherit]"
          >
            <properties.FieldElement
              className={cn(
                "font-[var(--field-weight)] text-[var(--field-color)] leading-[var(--leading)] text-(length:--field-size)",
                {
                  "cursor-pointer hover:underline": liveMode === "config",
                },
              )}
              style={
                {
                  "--field-weight": properties.fieldWeight,
                  "--field-color": properties.fieldColor,
                  "--field-size": `${properties.fieldSize}pt`,
                  "--leading": properties.fieldHeight, // multiplies by current size
                  fontFamily: `"${fontFamily}", sans-serif`,
                } as React.CSSProperties
              }
            >
              {value}
            </properties.FieldElement>
          </button>
        }
      />
      <PopoverContent
        side="bottom"
        className="p-0 shadow-none w-80"
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      >
        <ConfigCardItem
          header={
            <>
              <CardTitle>
                {elementNameMap[properties.FieldElement]} Element
              </CardTitle>
              <CardAction>
                <SquareColorPicker
                  inputColor={fieldColor}
                  defaultColor={defaultColor}
                  handleColorChange={handleColorChange} />
              </CardAction>
            </>
          }
          content={<FieldConfig fieldRole={properties.fieldRole} />}
        />
      </PopoverContent>
    </Popover>
  );
};
