import { useResumeStore } from "#/store/useResumeStore";
import { ALIGNMENT_MAP, SCALE_CURVES } from "./LivePreview";
import { DividerItem } from "./DividerItem";
import { LiveFieldItem } from "./LiveFieldItem";
import type { FieldType, SectionType, TemplateType } from "#/types/Template";
import {
  constructLayoutMatrix,
  getFieldProperties,
} from "#/utils/live-preview";
import { cn } from "#/lib/utils";

interface SectionItemProps {
  templateData: TemplateType;
  dbSection: SectionType;
}

export const LiveSortableSectionItem = ({
  dbSection,
  templateData,
}: SectionItemProps) => {
  const liveSections = useResumeStore((store) => store.liveMainSections);

  // Alignment
  const titleAlignment =
    ALIGNMENT_MAP[dbSection.default_config.alignment.title];

  return (
    <section className={`text-(length:--font-size-base) text-wrap`}>
      {/* Section Title */}
      <h2
        className={`text-(length:--section-title-size) text-[var(--section-title-color)] font-[var(--section-title-weight)]  ${titleAlignment}`}
      >
        {dbSection.title}
      </h2>

      {templateData.default_config.decorations.section_divider && (
        <DividerItem templateData={templateData} />
      )}

      {/* Sub Sections */}
      <div
        className={cn("flex flex-col", {
          "gap-[var(--instance-gap)]":
            dbSection.default_config.spacing.instance_gap,
        })}
      >
        {liveSections[dbSection.id].map((liveSubSection) => {
          const matrix = constructLayoutMatrix(dbSection.fields);

          // Formats Input Field Value
          const formatFieldValue = (field: FieldType) => {
            const value = liveSubSection.fields[field.id];

            const currrentRowIndex = field.alignment?.rowIndex ?? 0;
            const currentItemOrder = field.alignment?.itemOrder ?? 0;
            const previousFieldInRow =
              matrix[currrentRowIndex][currentItemOrder - 1];

            //Location Alterations
            if (field.name.includes("location") && value) {
              // Previous and current element are in the same position + previous item exists
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
              const rawInputDate = new Date(`${value}T23:59:59`); // hacky way to compare current date with selected date
              const rawTodayDate = new Date();

              const formattedInputDate = formatDate(rawInputDate); // year-month-day

              // Both previous and current field is a date + previous value exists
              if (
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
              <ul className="list-[var(--bullet-style)] text-[var(--bullet-color)] font-[var(--bullet-weight)] pl-[var(--bullet-indentation)] list-inside">
                {liveSubSection.bullets.map((bullet) => (
                  <li key={bullet.id}>
                    {bullet.text}

                    {/* Bullet's Sub Bullets */}
                    <ul className="list-[var(--sub-bullet-style)] pl-[var(--bullet-indentation)] list-inside">
                      {bullet.subBullets.map((subBullet) => (
                        <li key={subBullet.id}>{subBullet.text}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const formatDate = (unformattedDate: Date) => {
  const month = unformattedDate.toLocaleDateString("default", {
    month: "long",
  });
  const year = unformattedDate.getFullYear();

  return `${month}\u00A0${year}`;
};
