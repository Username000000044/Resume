import { debounce } from "lodash";
import { cn } from "#/lib/utils";
import { useResumeStore } from "#/store/useResumeStore";
import { useEffect, useMemo, type ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { Field, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import type { FieldType, SectionType } from "#/types/Template";
import { Textarea } from "#/components/ui/textarea";

interface FieldInputProps {
  field: FieldType;
  section: SectionType;
  subSectionIndex: number;
}

export const FieldInput = ({
  field,
  section,
  subSectionIndex,
}: FieldInputProps) => {
  const { sections, updateField } = useResumeStore(
    useShallow((store) => ({
      sections: store.sections,
      updateField: store.updateField,
    })),
  );

  const value =
    sections[section.id].subSections[subSectionIndex].fields[field.id] || "";

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;

    updateField(section.id, subSectionIndex, field.id, value);
  };

  const colsTwoFieldTypes: FieldType["type"][] = [
    "date",
    "tel",
    "email",
    "color",
  ];
  const colsTwoWords = ["name", "number"];

  return (
    <Field
      className={cn("col-span-full gap-0", {
        "col-span-2":
          colsTwoFieldTypes.includes(field.type) ||
          colsTwoWords.some((word) => field.name.toLowerCase().includes(word)),
      })}
    >
      <FieldLabel className="font-normal">{field.label}</FieldLabel>
      {field.type === "textarea" ? (
        <Textarea
          placeholder={field?.placeholder || ""}
          value={value}
          onChange={handleChange}
        />
      ) : (
        <Input
          name={field.label.toLowerCase().replaceAll(" ", "")}
          placeholder={field?.placeholder || ""}
          type={field.type}
          value={value}
          onChange={handleChange}
        />
      )}
    </Field>
  );
};
