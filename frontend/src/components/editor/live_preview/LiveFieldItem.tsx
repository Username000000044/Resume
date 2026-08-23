import type { FieldType, TemplateType } from "#/types/Template";

type FieldRole = FieldType["renderRole"];
type FontWeight =
  TemplateType["default_config"]["theme"]["typography"]["font_weight"][keyof TemplateType["default_config"]["theme"]["typography"]["font_weight"]];
type FieldElement =
  TemplateType["default_config"]["elements"][keyof TemplateType["default_config"]["elements"]];

interface LiveFieldProps {
  value: string;
  properties: {
    fieldRole: FieldRole;
    fieldWeight: FontWeight;
    FieldElement: FieldElement;
  };
}

export const FieldItem = ({ value, properties }: LiveFieldProps) => {
  return (
    <properties.FieldElement
      className="font-[var(--field-weight)]"
      style={
        {
          "--field-weight": properties.fieldWeight,
        } as React.CSSProperties
      }
    >
      {value}
    </properties.FieldElement>
  );
};
