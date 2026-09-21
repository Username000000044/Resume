import { useResumeStore } from "#/store/useResumeStore";
import { ALIGNMENT_MAP } from "./LivePreview";
import { DividerItem } from "./DividerItem";
import { LiveFieldItem } from "./LiveFieldItem";
import type { FieldType, SectionType, TemplateType } from "#/types/Template";
import {
  constructLayoutMatrix,
  getElementProperties,
} from "#/utils/live-preview";
import { cn } from "#/lib/utils";
import { LiveFieldGroupWrapper } from "./LiveFieldGroupWrapper";
import { useMemo, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { Button } from "#/components/ui/button";
import { GripHorizontal } from "lucide-react";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import type { fieldPositionEnum } from "@resume/backend/src/db/schema.js";
import { useShallow } from "zustand/react/shallow";
import { BarScrubberItem } from "./BarScrubberItem";

interface SectionItemProps {
  templateData: TemplateType;
  dbSection: SectionType;
  dbSectionIndex: number;
}

export const LiveSortableSectionItem = ({
  dbSection,
  dbSectionIndex,
  templateData,
}: SectionItemProps) => {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({
    id: dbSection.id,
    index: dbSectionIndex,
    element,
    handle: handleRef,
    modifiers: [RestrictToVerticalAxis],
  });

  const sections = useResumeStore((store) => store.sections);
  const { config, defaultConfig, liveMode } = useResumeConfigStore(
    useShallow((store) => ({
      config: store.config,
      defaultConfig: store.defaultConfig,
      liveMode: store.liveMode,
    })),
  );

  const numOfFilledSections = useMemo(() => {
    return templateData.sections
      .filter((section) => section.order !== 0)
      .reduce((count, dbSection) => {
        const liveSection = sections[dbSection.id] || { subSections: [] };

        const sectionHasContent = liveSection.subSections.some((subSection) => {
          const contentField = dbSection.fields.some(
            (field) =>
              subSection.fields[field.id] && subSection.fields[field.id] !== "",
          );

          const contentBullet = subSection.bullets.some(
            (bullet) =>
              (bullet.text && bullet.text !== "") ||
              bullet.subBullets.some((subBullet) => subBullet.text !== ""),
          );

          return contentField || contentBullet;
        });

        return sectionHasContent ? count + 1 : count;
      }, 0);
  }, [templateData, sections]);

  // Alignment
  const titleAlignment =
    ALIGNMENT_MAP[dbSection.default_config.alignment.title];
  return (
    <li
      ref={setElement}
      className="relative text-(length:--font-size-base) text-wrap"
    >
      {/* Section Gap Adjuster */}
      {liveMode === "config" && (
        <div className="absolute -top-[calc(var(--section-gap)/2)] -translate-y-1/2 w-full">
          <BarScrubberItem
            defaultValue={defaultConfig.template.spacing.section_gap}
            path={["templateConfig", "spacing", "section_gap"]}
            config={{ max: 30, min: 0, step: 1 }}
          />
        </div>
      )}

      {/* Section Actions */}
      <div className="absolute top-1/2 -translate-y-1/2 -right-[calc(var(--page-margin)+50px)]">
        <div className="*:text-muted-foreground *:cursor-pointer *:hover:bg-transparent">
          <Button
            size="icon-sm"
            variant="ghost"
            ref={handleRef}
            disabled={numOfFilledSections === 1}
          >
            <GripHorizontal />
          </Button>
        </div>
      </div>
      {/* Section Content */}
      <section
        className={cn({
          "p-2 bg-white rounded-4xl shadow-md": isDragging,
        })}
      >
        {/* Section Title */}
        <LiveFieldItem
          value={dbSection.title}
          properties={getElementProperties("title", config.templateConfig)}
        />

        {config.templateConfig.decorations.section_divider && (
          <DividerItem template_config={config.templateConfig} />
        )}

        {/* Sub Sections */}
        <div
          className={cn("relative flex flex-col", {
            "gap-[var(--instance-gap)]":
              config.templateConfig.spacing.instance_gap,
          })}
        >
          {sections[dbSection.id].subSections.map((liveSubSection) => {
            const matrix = constructLayoutMatrix(dbSection.fields);

            const alignedRowItem = (
              rowIndex: number,
              alignment: (typeof fieldPositionEnum.enumValues)[number],
            ) => {
              const items = matrix[rowIndex].filter(
                (field) => field.alignment?.position === alignment,
              );

              return items.map((field) => (
                <LiveFieldGroupWrapper
                  key={field.id}
                  field={field}
                  value={liveSubSection.fields[field.id]}
                >
                  <LiveFieldItem
                    value={formatFieldValue(field)}
                    properties={getElementProperties(
                      "field",
                      config.templateConfig,
                      field,
                    )}
                  />
                </LiveFieldGroupWrapper>
              ));
            };

            // Formats Input Field Value
            const formatFieldValue = (field: FieldType) => {
              const value = liveSubSection.fields[field.id];

              const currrentRowIndex = field.alignment?.rowIndex ?? 0;
              const currentItemOrder = field.alignment?.itemOrder ?? 0;

              // Safe extraction of previous item
              const previousFieldInRow =
                matrix[currrentRowIndex]?.[currentItemOrder - 1];

              // Location Alterations
              if (field.name.includes("location") && value) {
                if (
                  previousFieldInRow &&
                  previousFieldInRow.alignment?.position ===
                    field.alignment?.position &&
                  liveSubSection.fields[previousFieldInRow.id]
                ) {
                  return `, ${value}`;
                }
              }

              // Date Alterations
              if (field.type === "date" && value) {
                const rawInputDate = new Date(`${value}T23:59:59`);
                const rawTodayDate = new Date();
                const formattedInputDate = formatDate(rawInputDate);

                if (
                  previousFieldInRow && // ✨ Safe check
                  previousFieldInRow.type === "date" &&
                  liveSubSection.fields[previousFieldInRow.id]
                ) {
                  return rawInputDate.valueOf() > rawTodayDate.valueOf()
                    ? "—Present"
                    : `—${formattedInputDate}`;
                }

                return rawInputDate.valueOf() > rawTodayDate.valueOf()
                  ? "Present"
                  : formattedInputDate;
              }
              return value;
            };

            // Instance Adjuster Conditions
            const sectionHasManyInstances =
              sections[dbSection.id].subSections.length > 1;
            const isNotFirstInstance = liveSubSection.order !== 0;

            return (
              <div className="relative" key={liveSubSection.id}>
                {sectionHasManyInstances &&
                  isNotFirstInstance &&
                  liveMode === "config" && (
                    <div className="absolute -top-[calc(var(--instance-gap)/2)] -translate-y-1/2 w-full">
                      <BarScrubberItem
                        defaultValue={
                          defaultConfig.template.spacing.instance_gap
                        }
                        path={["templateConfig", "spacing", "instance_gap"]}
                        config={{ max: 30, min: 0, step: 1 }}
                      />
                    </div>
                  )}
                {/* Row Index */}
                {matrix.map((_, rowIndex) => (
                  <div
                    key={matrix[rowIndex].map((field) => field.id).join("-")}
                  >
                    <div className="grid grid-cols-[auto_auto_auto] items-top w-full">
                      {/* Left Aligned */}
                      <div className="flex justify-start">
                        {alignedRowItem(rowIndex, "left")}
                      </div>

                      {/* Center Aligned */}
                      <div className="flex justify-center">
                        {alignedRowItem(rowIndex, "center")}
                      </div>

                      {/* Right Aligned */}
                      <div className="flex justify-end">
                        {alignedRowItem(rowIndex, "right")}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Section Bullets */}
                <ul className="list-[var(--bullet-style)] text-[var(--bullet-color)] font-[var(--bullet-weight)] pl-[var(--bullet-indentation)] list-inside">
                  {liveSubSection.bullets.map((bullet) => (
                    <span key={bullet.id}>
                      <LiveFieldItem
                        key={bullet.id}
                        value={bullet.text}
                        properties={getElementProperties(
                          "bullet",
                          config.templateConfig,
                        )}
                      />

                      {/* Bullet's Sub Bullets */}
                      <ul className="list-[var(--sub-bullet-style)] pl-[var(--bullet-indentation)] list-inside">
                        {bullet.subBullets.map((subBullet) => (
                          <LiveFieldItem
                            key={subBullet.id}
                            value={subBullet.text}
                            properties={getElementProperties(
                              "bullet",
                              config.templateConfig,
                            )}
                          />
                        ))}
                      </ul>
                    </span>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </li>
  );
};

const formatDate = (unformattedDate: Date) => {
  const month = unformattedDate.toLocaleDateString("default", {
    month: "long",
  });
  const year = unformattedDate.getFullYear();

  return `${month}\u00A0${year}`;
};
