import { Plus, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../backend/src/appRouter";
import { useResumeStore, type MainBullet } from "#/store/useResumeStore";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { debounce } from "lodash";
import { useShallow } from "zustand/react/shallow";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { MAX_SUB_BULLET_COUNT } from "./EditorTabs";

type TemplateType = inferRouterOutputs<AppRouter>["templateById"];
type SectionType = TemplateType["sections"][number];

interface FieldInputProps {
  mainBullet: MainBullet;
  section: SectionType;
  bulletIndex: number;
  subSectionIndex: number;
}

export const BulletItem = ({
  mainBullet,
  section,
  subSectionIndex,
  bulletIndex,
}: FieldInputProps) => {
  const { sectionGroup, updateMainBullet, removeMainBullet, addSubBullet } =
    useResumeStore(
      useShallow((store) => ({
        sectionGroup: store.sectionGroup,
        updateMainBullet: store.updateMainBullet,
        removeMainBullet: store.removeMainBullet,
        addSubBullet: store.addSubBullet,
      })),
    );

  const [localValue, setLocalValue] = useState(
    sectionGroup[section.id][subSectionIndex].bullets[bulletIndex].text || "",
  );

  const debouncedSave = useMemo(
    () =>
      debounce((value) => {
        console.log("Saving to localstorage:", value);
        updateMainBullet(section.id, subSectionIndex, mainBullet.id, value);
      }, 500), // 500ms debounce
    [section.id, mainBullet.id, subSectionIndex, updateMainBullet],
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
      <div className="flex justify-between">
        <FieldLabel className="font-normal">
          Bullet {bulletIndex + 1}
        </FieldLabel>
        <Button
          variant="link"
          size="xs"
          className="font-normal"
          onClick={() =>
            addSubBullet(section.id, subSectionIndex, mainBullet.id)
          }
          disabled={mainBullet.subBullets.length >= MAX_SUB_BULLET_COUNT}
        >
          + Sub Bullet
        </Button>
      </div>
      <InputGroup>
        <InputGroupInput
          name={mainBullet.id}
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
              removeMainBullet(section.id, subSectionIndex, mainBullet.id)
            }
            aria-label={`Remove main-bullet ${bulletIndex + 1}`}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
};
