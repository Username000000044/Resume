import { X } from "lucide-react";
import type { inferRouterOutputs } from "@trpc/server";
import { useResumeStore, type MainBullet } from "#/store/useResumeStore";
import { useEffect, useMemo, type ChangeEvent } from "react";
import { debounce } from "lodash";
import { useShallow } from "zustand/react/shallow";
import { MAX_SUB_BULLET_COUNT } from "./EditorTabs";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "#/components/ui/input-group";
import type { AppRouter } from "../../../../../backend/src/appRouter";
import { Field, FieldLabel } from "#/components/ui/field";
import { Button } from "#/components/ui/button";

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
  const {
    liveMainSections,
    updateLiveMainBullet,
    updateMainBullet,
    removeMainBullet,
    addSubBullet,
  } = useResumeStore(
    useShallow((store) => ({
      liveMainSections: store.liveMainSections,
      updateMainBullet: store.updateMainBullet,
      updateLiveMainBullet: store.updateLiveMainBullet,
      removeMainBullet: store.removeMainBullet,
      addSubBullet: store.addSubBullet,
    })),
  );

  const liveValue =
    liveMainSections[section.id][subSectionIndex].bullets[bulletIndex].text ||
    "";

  const debouncedSave = useMemo(
    () =>
      debounce((value) => {
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
    updateLiveMainBullet(section.id, subSectionIndex, mainBullet.id, value); // Fast
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
          value={liveValue}
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
