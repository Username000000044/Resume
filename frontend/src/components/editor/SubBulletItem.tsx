import { Plus, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../backend/src/appRouter";
import {
  useResumeStore,
  type MainBullet,
  type SubBullet,
} from "#/store/useResumeStore";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { debounce } from "lodash";
import { useShallow } from "zustand/react/shallow";
import { Field, FieldGroup, FieldLabel } from "../ui/field";

type TemplateType = inferRouterOutputs<AppRouter>["templateById"];
type SectionType = TemplateType["sections"][number];

interface FieldInputProps {
  section: SectionType;
  mainBullet: MainBullet;
  subBullet: SubBullet;
  subBulletIndex: number;
  subSectionIndex: number;
}

export const SubBulletItem = ({
  section,
  mainBullet,
  subBullet,
  subSectionIndex,
  subBulletIndex,
}: FieldInputProps) => {
  const { removeSubBullet, updateSubBullet } = useResumeStore(
    useShallow((store) => ({
      removeSubBullet: store.removeSubBullet,
      updateSubBullet: store.updateSubBullet,
    })),
  );

  const [localValue, setLocalValue] = useState(
    mainBullet.subBullets[subBulletIndex].text || "",
  );

  const debouncedSave = useMemo(
    () =>
      debounce((value) => {
        console.log("Saving to localstorage:", value);

        updateSubBullet(
          section.id,
          subSectionIndex,
          mainBullet.id,
          subBullet.id,
          value,
        );
      }, 500), // 500ms debounce
    [section.id, mainBullet.id, subBullet.id, subSectionIndex, updateSubBullet],
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

  return (
    <Field className="gap-0">
      <FieldLabel className="font-normal">Sub Bullet</FieldLabel>
      <InputGroup>
        <InputGroupInput
          name={subBullet.id}
          value={localValue}
          type="text"
          onChange={handleChange}
          onBlur={() => debouncedSave.flush()}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            variant="ghost_destructive"
            size="icon-xs"
            onClick={() =>
              removeSubBullet(
                section.id,
                subSectionIndex,
                mainBullet.id,
                subBullet.id,
              )
            }
            aria-label={`Remove sub-bullet ${subBulletIndex + 1}`}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
};
