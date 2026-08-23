import { useResumeStore } from "#/store/useResumeStore";
import { ALIGNMENT_MAP } from "./LiveTemplate";
import { DividerItem } from "./DividerItem";
import { FieldItem } from "./LiveFieldItem";
import type { FieldType, SectionType, TemplateType } from "#/types/Template";

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
  const titleAlignment =
    ALIGNMENT_MAP[dbSection.default_config.alignment.title];

  return (
    <section className={`text-(length:--font_size_base) text-wrap`}>
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
          const matrix = constructLayoutMatrix(dbSection.fields);

          // Exposes Field Template Data
          const getFieldProperties = (field: FieldType) => {
            const fieldRole = field.renderRole;
            const fieldWeight =
              templateData.default_config.theme.typography.font_weight[
                fieldRole
              ];
            // const fieldColor = templateData.default_config.theme.colors.
            const FieldElement =
              templateData.default_config.elements[fieldRole] ?? "p";

            return { fieldRole, fieldWeight, FieldElement };
          };

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
                          <FieldItem
                            key={field.id}
                            value={formatFieldValue(field)}
                            properties={getFieldProperties(field)}
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
                          <FieldItem
                            key={field.id}
                            value={formatFieldValue(field)}
                            properties={getFieldProperties(field)}
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
                          <FieldItem
                            key={field.id}
                            value={formatFieldValue(field)}
                            properties={getFieldProperties(field)}
                          />
                        );
                      })}
                  </div>
                </div>
              ))}

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

const formatDate = (unformattedDate: Date) => {
  const month = unformattedDate.toLocaleDateString("default", {
    month: "long",
  });
  const year = unformattedDate.getFullYear();

  return `${month}\u00A0${year}`;
};

const constructLayoutMatrix = (fields: FieldType[]) => {
  const matrix: FieldType[][] = [];

  for (const field of fields) {
    // Fallback for missing layout metadata
    const rowIndex = field.alignment?.rowIndex ?? 0;

    // Ensure nested row array exists
    if (!matrix[rowIndex]) {
      matrix[rowIndex] = [];
    }

    matrix[rowIndex].push(field);
  }

  // Remove empty gaps and sort row by interOrder horizontally
  return matrix
    .filter(Boolean)
    .map((row) =>
      row.sort(
        (a, b) => (a.alignment?.itemOrder ?? 0) - (b.alignment?.itemOrder ?? 0),
      ),
    );
};
