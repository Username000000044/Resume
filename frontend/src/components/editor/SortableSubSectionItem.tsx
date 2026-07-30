import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../backend/src/appRouter";
import { useResumeStore, type SubSectionData } from "#/store/useResumeStore";
import { Card, CardContent } from "../ui/card";
import { FieldGroup } from "../ui/field";
import { FieldInput } from "./FieldInput";
import { Button } from "../ui/button";
import { cn } from "#/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { MAX_BULLET_COUNT } from "./EditorTabs";
import { GripHorizontal, Plus, Trash2 } from "lucide-react";
import { BulletItem } from "./BulletItem";
import { SubBulletItem } from "./SubBulletItem";
import { useRef, useState, type RefObject } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";

type SectionType =
  inferRouterOutputs<AppRouter>["templatesList"][number]["sections"][number];

interface SectionCardTypes {
  section: SectionType;
  subSection: SubSectionData;
  subSectionIndex: number;
}

export const SortableSubSectionItem = ({
  section,
  subSection,
  subSectionIndex,
}: SectionCardTypes) => {
  const { addMainBullet, removeSubSection, mainSectionsStorage } =
    useResumeStore(
      useShallow((state) => ({
        mainSectionsStorage: state.mainSections,
        addMainBullet: state.addMainBullet,
        removeSubSection: state.removeSubSection,
      })),
    );

  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({
    id: subSection.id,
    index: subSectionIndex,
    element,
    handle: handleRef,
    modifiers: [RestrictToVerticalAxis],
  });

  return (
    <li ref={setElement} className="relative">
      {/* Section Actions */}
      {section.manyInstances && (
        <div className="absolute top-1/2 -translate-y-1/2 -left-10">
          <div className="flex flex-col *:text-muted-foreground *:cursor-pointer *:hover:bg-transparent">
            <Button
              size="icon-sm"
              variant="ghost"
              ref={handleRef}
              disabled={mainSectionsStorage[section.id].length === 1}
            >
              <GripHorizontal />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost_destructive"
              onClick={() => removeSubSection(section.id, subSectionIndex)}
              disabled={
                mainSectionsStorage[section.id][subSectionIndex].order === 0
              }
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      )}

      {/* Section Content */}
      <Card
        className={cn("gap-0 w-full", {
          "shadow-2xl": isDragging,
        })}
      >
        <CardContent>
          {/* Section Fields */}
          <FieldGroup className="grid grid-cols-4 gap-3">
            {section.fields.map((field) => (
              <FieldInput
                key={field.id}
                field={field}
                section={section}
                subSectionIndex={subSectionIndex}
              />
            ))}
          </FieldGroup>

          {/* Bullets */}
          {section.manyInstances && (
            <Button
              variant="outline"
              size="xs"
              className={cn("col-span-full w-25 mt-8", {
                "mb-8":
                  mainSectionsStorage[section.id][subSectionIndex].bullets
                    .length > 0,
              })}
              onClick={() => addMainBullet(section.id, subSectionIndex)}
              disabled={
                mainSectionsStorage[section.id][subSectionIndex].bullets
                  .length >= MAX_BULLET_COUNT
              }
            >
              <Plus /> Add Bullet
            </Button>
          )}

          {mainSectionsStorage[section.id][subSectionIndex].bullets.map(
            (mainBullet, mainBulletIndex) => (
              <FieldGroup
                key={mainBullet.id}
                className="grid grid-cols-6 gap-3"
              >
                <div className="col-span-5">
                  <BulletItem
                    section={section}
                    mainBullet={mainBullet}
                    subSectionIndex={subSectionIndex}
                    bulletIndex={mainBulletIndex}
                  />
                </div>

                {/* Sub Bullets */}
                <FieldGroup className="col-start-2 col-span-4 gap-3 mb-3">
                  {mainBullet.subBullets.map((subBullet, subBulletIndex) => (
                    <SubBulletItem
                      key={subBullet.id}
                      section={section}
                      mainBullet={mainBullet}
                      subBullet={subBullet}
                      subSectionIndex={subSectionIndex}
                      subBulletIndex={subBulletIndex}
                    />
                  ))}
                </FieldGroup>
              </FieldGroup>
            ),
          )}
        </CardContent>
      </Card>
    </li>
  );
};
