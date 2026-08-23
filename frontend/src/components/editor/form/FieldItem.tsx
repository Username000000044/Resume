import { debounce } from "lodash";
import { cn } from "#/lib/utils";
import { useResumeStore } from "#/store/useResumeStore";
import { useEffect, useMemo, type ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { Field, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import type { FieldType, SectionType } from "#/types/Template";

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
  const { liveMainSections, updateLiveField, updateField } = useResumeStore(
    useShallow((store) => ({
      liveMainSections: store.liveMainSections,
      updateLiveField: store.updateLiveField,
      updateField: store.updateField,
    })),
  );

  const liveValue =
    liveMainSections[section.id][subSectionIndex].fields[field.id] || "";

  const debouncedSave = useMemo(
    () =>
      debounce((value) => {
        updateField(section.id, subSectionIndex, field.id, value);
      }, 500), // 500ms debounce
    [section.id, field.id, subSectionIndex, updateField],
  );

  // Cleanup debouced fn if componet unmounts
  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateLiveField(section.id, subSectionIndex, field.id, value); // Fast
    debouncedSave(value); // Waits for user to stop typing before saving
  };

  const colsTwo: FieldType["type"][] = ["date", "tel", "email", "color"];

  return (
    <Field
      className={cn("col-span-full gap-0", {
        "col-span-2":
          colsTwo.includes(field.type) ||
          field.label.toLowerCase().includes("name"),
      })}
    >
      <FieldLabel className="font-normal">{field.label}</FieldLabel>
      <Input
        name={field.label.toLowerCase().replaceAll(" ", "")}
        placeholder={field?.placeholder || ""}
        type={field.type}
        value={liveValue}
        onChange={handleChange}
        onBlur={() => debouncedSave.flush()}
      />
    </Field>
  );
};
