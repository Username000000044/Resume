import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../../backend/src/appRouter";
import { useResumeStore } from "#/store/useResumeStore";
import { TEXT_ALIGNMENT } from "./LiveTemplate";
import { DividerItem } from "./DividerItem";
import { cn } from "#/lib/utils";

type TemplateType = inferRouterOutputs<AppRouter>["templateById"];
type SectionType = TemplateType["sections"][number];

interface SectionItemProps {
  templateData: TemplateType;
  dbSection: SectionType;
}

export const SortableSectionItem = ({
  dbSection,
  templateData,
}: SectionItemProps) => {
  const liveSections = useResumeStore((store) => store.liveMainSections);

  // Alignment
  const alignmentKey = templateData.default_config.alignment;
  const bodyAlignment = TEXT_ALIGNMENT[alignmentKey.body];
  const titleAlignment = TEXT_ALIGNMENT[alignmentKey.titles];

  return (
    <section className={`text-(length:--font_size_base) ${bodyAlignment}`}>
      {/* Section Title */}
      <h2 className={`text-(length:--h2-size) font-bold ${titleAlignment}`}>
        {dbSection.title}
      </h2>

      {templateData.default_config.decorations.section_divider && (
        <DividerItem templateData={templateData} />
      )}

      {/* Sub Sections */}
      <div className="flex flex-col gap-[var(--instance-gap)]">
        {liveSections[dbSection.id].map((liveSubSection) => {
          // Find all unique row numbers
          const uniqueRows = Array.from(
            new Set(dbSection.fields.map((f) => f.row)),
          ).sort((a, b) => a - b);

          return (
            <div key={liveSubSection.id}>
              {uniqueRows.map((rowNum) => {
                //Fields in current row, sorted left -> right by rowIndex
                const rowFields = dbSection.fields
                  .filter((field) => field.row === rowNum)
                  .sort((a, b) => a.rowIndex - b.rowIndex);

                return (
                  <div
                    key={`${liveSubSection.id}-row-${rowNum}`}
                    className="flex"
                  >
                    {rowFields.map((currentRowField) => {
                      const fieldValue =
                        liveSubSection.fields[currentRowField.id];

                      return (
                        <p
                          key={currentRowField.id}
                          className={cn("w-full", {
                            "text-right flex-1":
                              currentRowField.type === "date",
                          })}
                        >
                          {fieldValue}
                        </p>
                      );
                    })}
                  </div>
                );
              })}

              {/* Section Bullets */}
              <ul className="list-[var(--bullet-style)] list-inside pl-8">
                {liveSubSection.bullets.map((bullet) => (
                  <li key={bullet.id}>
                    {bullet.text}

                    {/* Bullet's Sub Bullets */}
                    <ul className="list-[var(--sub-bullet-style)] list-inside pl-8">
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
