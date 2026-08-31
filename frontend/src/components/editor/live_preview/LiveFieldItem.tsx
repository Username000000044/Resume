import type { FieldType, TemplateType } from "#/types/Template";
import type { SCALE_CURVES } from "./LiveTemplate";

type FieldRole = FieldType["renderRole"];
type FieldColor =
  TemplateType["default_config"]["theme"]["colors"][keyof TemplateType["default_config"]["theme"]["colors"]];
type FontWeight =
  TemplateType["default_config"]["theme"]["typography"]["font_weight"][keyof TemplateType["default_config"]["theme"]["typography"]["font_weight"]];

type FieldSize = number; //fix!!!!!!!!!!!!!!!!!!!!!!

type FieldElement =
  TemplateType["default_config"]["elements"][keyof TemplateType["default_config"]["elements"]];

interface LiveFieldProps {
  value: string;
  properties: {
    fieldRole: FieldRole;
    fieldWeight: FontWeight;
    fieldColor: FieldColor;
    fieldSize: FieldSize;
    FieldElement: FieldElement;
  };
}

export const LiveFieldItem = ({ value, properties }: LiveFieldProps) => {
  return (
    <properties.FieldElement
      className="font-[var(--field-weight)] text-[var(--field-color)] text-(length:--field-size)"
      style={
        {
          "--field-weight": properties.fieldWeight,
          "--field-color": properties.fieldColor,
          "--field-size": `${properties.fieldSize}pt`,
        } as React.CSSProperties
      }
    >
      {value}
    </properties.FieldElement>
  );
};
