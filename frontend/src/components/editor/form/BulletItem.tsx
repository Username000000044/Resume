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
import type { SectionType } from "#/types/Template";

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
  const { sections, updateMainBullet, removeMainBullet, addSubBullet } =
    useResumeStore(
      useShallow((store) => ({
        sections: store.sections,
        updateMainBullet: store.updateMainBullet,
        removeMainBullet: store.removeMainBullet,
        addSubBullet: store.addSubBullet,
      })),
    );

  const value =
    sections[section.id].subSections[subSectionIndex].bullets[bulletIndex]
      .text || "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateMainBullet(section.id, subSectionIndex, mainBullet.id, value);
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
