import { debounce } from "lodash";
import { cn } from "#/lib/utils";
import type { inferRouterOutputs } from "@trpc/server";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { AppRouter } from "../../../../backend/src/appRouter";
import { useResumeStore } from "#/store/useResumeStore";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

type TemplateType = inferRouterOutputs<AppRouter>["templateById"];
type SectionType = TemplateType["sections"][number];
type FieldType = TemplateType["sections"][number]["fields"][number];

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
  const updateField = useResumeStore((store) => store.updateField);
  const sectionGroup = useResumeStore((store) => store.mainSections);

  const [localValue, setLocalValue] = useState(
    sectionGroup[section.id][subSectionIndex].fields[field.id] || "",
  );

  const debouncedSave = useMemo(
    () =>
      debounce((value) => {
        console.log("Saving to localstorage:", value);
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
    setLocalValue(value); // Fast
    debouncedSave(value); // Waits for user to stop typing before saving
  };

  const colsTwo: FieldType["type"][] = ["date", "tel", "email"];

  return (
    <Field
      className={cn("col-span-full gap-0", {
        "col-span-2":
          colsTwo.includes(field.type) ||
          field.name.toLowerCase().includes("name"),
      })}
    >
      <FieldLabel className="font-normal">{field.name}</FieldLabel>
      <Input
        name={field.name}
        placeholder={field?.placeholder || ""}
        type={field.type}
        value={localValue}
        onChange={handleChange}
        onBlur={() => debouncedSave.flush()}
      />
    </Field>
  );
};
