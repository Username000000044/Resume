import { useResumeStore } from "#/store/useResumeStore";
import type { FieldType, SectionType, TemplateType } from "#/types/Template";
import { DividerItem } from "./DividerItem";
import { LiveFieldItem } from "./LiveFieldItem";
import {
  constructLayoutMatrix,
  getFieldProperties,
} from "#/utils/live-preview";

interface HeaderItemProps {
  templateData: TemplateType;
  dbSection: SectionType;
}

export const LiveHeaderItem = ({
  dbSection,
  templateData,
}: HeaderItemProps) => {
  const liveSections = useResumeStore((store) => store.liveMainSections);

  return (
    <section className={`text-(length:--font-size-base) text-wrap`}>
      {/* Sub Sections */}
      <div className="flex flex-col gap-[var(--instance-gap)]">
        {liveSections[dbSection.id].map((liveSubSection) => {
          const matrix = constructLayoutMatrix(dbSection.fields);

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

            // Secondary Heading
            if (
              previousFieldInRow &&
              previousFieldInRow.renderRole !== "heading"
            ) {
              const seperator = "·";
              const seperatorSpacing = `\u00A0\u00A0${seperator}\u00A0\u00A0`;

              return `${seperatorSpacing}${value}`;
            }

            if (field.name.includes("location") && value) {
              //Location Alterations
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
                    {matrix[rowIndex]
                      .filter((field) => field.alignment?.position === "left")
                      .map((field) => {
                        return (
                          <LiveFieldItem
                            key={field.id}
                            value={formatFieldValue(field)}
                            properties={getFieldProperties(field, templateData)}
                          />
                        );
                      })}
                  </div>

                  {/* Center Aligned */}
                  <div className="flex justify-center">
                    {matrix[rowIndex]
                      .filter((field) => field.alignment?.position === "center")
                      .map((field) => {
                        return (
                          <LiveFieldItem
                            key={field.id}
                            value={formatFieldValue(field)}
                            properties={getFieldProperties(field, templateData)}
                          />
                        );
                      })}
                  </div>

                  {/* Right Aligned */}
                  <div className="flex justify-end">
                    {matrix[rowIndex]
                      .filter((field) => field.alignment?.position === "right")
                      .map((field) => {
                        return (
                          <LiveFieldItem
                            key={field.id}
                            value={formatFieldValue(field)}
                            properties={getFieldProperties(field, templateData)}
                          />
                        );
                      })}
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

      {templateData.default_config.decorations.header_divider && (
        <DividerItem templateData={templateData} />
      )}
    </section>
  );
};
