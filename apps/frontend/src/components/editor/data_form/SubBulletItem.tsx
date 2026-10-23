import { X } from "lucide-react";
import {
  useResumeSectionsStore,
  type MainBullet,
  type SubBullet,
} from "#/store/useResumeSectionsStore";
import { useShallow } from "zustand/react/shallow";
import { type ChangeEvent } from "react";
import { Field, FieldLabel } from "#/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "#/components/ui/input-group";
import type { SectionType } from "#/types/trpc";

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
  const { sections, removeSubBullet, updateSubBullet } = useResumeSectionsStore(
    useShallow((store) => ({
      sections: store.sections,
      removeSubBullet: store.removeSubBullet,
      updateSubBullet: store.updateSubBullet,
    })),
  );

  const value =
    sections[section.id].subSections[subSectionIndex].bullets[mainBulletIndex]
      .subBullets[subBulletIndex].text || "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    updateSubBullet(
      section.id,
      subSectionIndex,
      mainBullet.id,
      subBullet.id,
      value,
    );
  };

  return (
    <Field className="gap-0">
      <FieldLabel className="font-normal">Sub Bullet</FieldLabel>
      <InputGroup>
        <InputGroupInput
          name={subBullet.id}
          value={value}
          type="text"
          onChange={handleChange}
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
