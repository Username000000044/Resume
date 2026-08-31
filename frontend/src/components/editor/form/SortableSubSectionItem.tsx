import type { inferRouterOutputs } from "@trpc/server";
import { useResumeStore, type SubSectionData } from "#/store/useResumeStore";
import { cn } from "#/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { MAX_BULLET_COUNT } from "./EditorTabs";
import { GripHorizontal, Plus, Trash2 } from "lucide-react";
import { BulletItem } from "./BulletItem";
import { SubBulletItem } from "./SubBulletItem";
import { useRef, useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { FieldGroup } from "#/components/ui/field";
import { FieldInput } from "./FieldItem";
import type { SectionType, TemplateType } from "#/types/Template";

interface SectionCardTypes {
  section: SectionType;
  sectionIndex: number;
  subSection: SubSectionData;
  subSectionIndex: number;
  templateData: TemplateType;
}

export const SortableSubSectionItem = ({
  section,
  sectionIndex,
  subSection,
  subSectionIndex,
  templateData,
}: SectionCardTypes) => {
  const { addMainBullet, removeSubSection, mainSectionsStorage } =
    useResumeStore(
      useShallow((state) => ({
        mainSectionsStorage: state.persistantMainSections,
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
      <div
        className={cn("absolute top-1/2 -translate-y-1/2 -left-[35px]", {
          hidden: !section.manyInstances,
        })}
      >
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

      {/* Section Content */}
      <Card
        className={cn("gap-0 w-full", {
          "shadow-2xl": isDragging,
        })}
      >
        <CardContent>
          {/* Section Fields */}
          <FieldGroup className="grid grid-cols-4 gap-3">
            {section.fields
              .sort((a, b) => {
                const alignA = a.alignment;
                const alignB = b.alignment;

                if (!alignA || !alignB) return 0;

                return alignA.rowIndex === alignB.rowIndex
                  ? alignA.itemOrder - alignB.itemOrder
                  : alignA.rowIndex - alignB.rowIndex;
              })
              .map((field) => (
                <FieldInput
                  key={field.id}
                  field={field}
                  section={section}
                  subSectionIndex={subSectionIndex}
                />
              ))}
          </FieldGroup>

          {/* Bullets */}
          {section.order !== 0 && (
            <Button
              variant="outline"
              size="xs"
              className={cn("col-span-full w-25", {
                "mt-8": templateData.sections[sectionIndex].fields.length >= 1,
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
                      subBullet={subBullet}
                      mainBullet={mainBullet}
                      mainBulletIndex={mainBulletIndex}
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
