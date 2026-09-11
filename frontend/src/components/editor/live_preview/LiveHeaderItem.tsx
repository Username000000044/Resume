import { useResumeStore } from "#/store/useResumeStore";
import type { FieldType, SectionType } from "#/types/Template";
import { DividerItem } from "./DividerItem";
import { LiveFieldItem } from "./LiveFieldItem";
import {
  constructLayoutMatrix,
  getFieldProperties,
} from "#/utils/live-preview";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { useShallow } from "zustand/react/shallow";
import { LiveFieldGroupWrapper } from "./LiveFieldGroupWrapper";
import type { fieldPositionEnum } from "@resume/backend/src/db/schema.js";

interface HeaderItemProps {
  dbSection: SectionType;
}

export const LiveHeaderItem = ({ dbSection }: HeaderItemProps) => {
  const sections = useResumeStore((store) => store.sections);
  const { config, defaultTemplateConfig } = useResumeConfigStore(
    useShallow((store) => ({
      config: store.config,
      defaultTemplateConfig: store.defaultConfig.template,
    })),
  );

  return (
    <section className={`text-(length:--font-size-base) text-wrap`}>
      {/* Sub Sections */}
      <div className="flex flex-col gap-[var(--instance-gap)]">
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
                  properties={getFieldProperties(field, config.templateConfig)}
                />
              </LiveFieldGroupWrapper>
            ));
          };

          // Formats Input Field Value
          const formatFieldValue = (field: FieldType) => {
            const value = liveSubSection.fields[field.id];

            const currrentRowIndex = field.alignment?.rowIndex ?? 0;
            const currentItemOrder = field.alignment?.itemOrder ?? 0;
            const previousFieldInRow =
              matrix[currrentRowIndex][currentItemOrder - 1];

            // Heading Alterations
            if (
              previousFieldInRow &&
              previousFieldInRow.renderRole === "heading"
            ) {
              return `\u00A0${value}`;
            }

            //Location Alterations
            if (field.name.includes("location") && value) {
              // Previous and current element are in the same position + previous item exists
              if (
                previousFieldInRow &&
                previousFieldInRow.alignment?.position ===
                  field.alignment?.position &&
                liveSubSection.fields[previousFieldInRow.id]
              ) {
                return `,\u00A0${value}`;
              }
            }

            return value;
          };

          return (
            <div key={liveSubSection.id}>
              {/* Row Index */}
              {matrix.map((_, rowIndex) => (
                <div
                  key={crypto.randomUUID()}
                  className="grid grid-cols-[auto_auto_auto] items-top w-full"
                >
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
              ))}

              {/* Section Bullets */}
              {/* <ul className="list-[var(--bullet-style)] text-[var(--bullet-color)] font-[var(--bullet-weight)] list-inside pl-8">
                {liveSubSection.bullets.map((bullet) => (
                  <li key={bullet.id}>
                    {bullet.text}

                    <ul className="list-[var(--sub-bullet-style)] list-inside pl-8">
                      {bullet.subBullets.map((subBullet) => (
                        <li key={subBullet.id}>{subBullet.text}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul> */}
            </div>
          );
        })}
      </div>

      {defaultTemplateConfig.decorations.header_divider && (
        <DividerItem template_config={config.templateConfig} />
      )}
    </section>
  );
};
