import type { FieldType, TemplateType } from "#/types/Template";
import type { PRESET_MAP } from "./LivePreview";

type FieldRole = FieldType["renderRole"];
type FieldColor =
  TemplateType["default_config"]["theme"]["colors"][keyof TemplateType["default_config"]["theme"]["colors"]];
type FontWeight =
  TemplateType["default_config"]["theme"]["typography"]["font_weight"][keyof TemplateType["default_config"]["theme"]["typography"]["font_weight"]];

type FieldSize = number; //fix!!!!!!!!!!!!!!!!!!!!!!

type FieldHeight =
  (typeof PRESET_MAP)[TemplateType["default_config"]["theme"]["typography"]["preset"]]["line_height"][keyof (typeof PRESET_MAP)[TemplateType["default_config"]["theme"]["typography"]["preset"]]["line_height"]];

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
    FieldElement: FieldElement;
  };
}

export const LiveFieldItem = ({ value, properties }: LiveFieldProps) => {
  return (
    <properties.FieldElement
      className="font-[var(--field-weight)] text-[var(--field-color)] leading-[var(--leading)] text-(length:--field-size)"
      style={
        {
          "--field-weight": properties.fieldWeight,
          "--field-color": properties.fieldColor,
          "--field-size": `${properties.fieldSize}pt`,
          "--leading": properties.fieldHeight, // multiplies by current size
        } as React.CSSProperties
      }
    >
      {value}
    </properties.FieldElement>
  );
};
