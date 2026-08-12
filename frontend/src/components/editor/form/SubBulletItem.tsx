import type { inferRouterOutputs } from "@trpc/server";
import { X } from "lucide-react";
import type { AppRouter } from "../../../../../backend/src/appRouter";
import {
  useResumeStore,
  type MainBullet,
  type SubBullet,
} from "#/store/useResumeStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useMemo, type ChangeEvent } from "react";
import { debounce } from "lodash";
import { Field, FieldLabel } from "#/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "#/components/ui/input-group";

type TemplateType = inferRouterOutputs<AppRouter>["templateById"];
type SectionType = TemplateType["sections"][number];

interface FieldInputProps {
  section: SectionType;
  subBullet: SubBullet;
  mainBullet: MainBullet;
  mainBulletIndex: number;
  subBulletIndex: number;
  subSectionIndex: number;
}

export const SubBulletItem = ({
  section,
  mainBullet,
  subBullet,
  mainBulletIndex,
  subSectionIndex,
  subBulletIndex,
}: FieldInputProps) => {
  const {
    liveMainSections,
    removeSubBullet,
    updateSubBullet,
    updateLiveSubBullet,
  } = useResumeStore(
    useShallow((store) => ({
      liveMainSections: store.liveMainSections,
      removeSubBullet: store.removeSubBullet,
      updateLiveSubBullet: store.updateLiveSubBullet,
      updateSubBullet: store.updateSubBullet,
    })),
  );

  const liveValue =
    liveMainSections[section.id][subSectionIndex].bullets[mainBulletIndex]
      .subBullets[subBulletIndex].text || "";

  const debouncedSave = useMemo(
    () =>
      debounce((value) => {
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
    updateLiveSubBullet(
      section.id,
      subSectionIndex,
      mainBullet.id,
      subBullet.id,
      value,
    ); // Fast
    debouncedSave(value); // Waits for user to stop typing before saving
  };

  return (
    <Field className="gap-0">
      <FieldLabel className="font-normal">Sub Bullet</FieldLabel>
      <InputGroup>
        <InputGroupInput
          name={subBullet.id}
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
