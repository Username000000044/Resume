import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../../backend/src/appRouter";
import { useResumeStore } from "#/store/useResumeStore";
import { SCALE_CURVES, TEXT_ALIGNMENT } from "./LiveTemplate";
import { DividerItem } from "./DividerItem";

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

  // Typography
  const font_size_base =
    templateData.default_config.theme.typography.font_size_base;
  const font_scale_curve =
    SCALE_CURVES[templateData.default_config.theme.typography.scale_curve];

  // Alignment
  const alignmentKey = templateData.default_config.alignment;
  const bodyAlignment = TEXT_ALIGNMENT[alignmentKey.body];
  const titleAlignment = TEXT_ALIGNMENT[alignmentKey.titles];

  return (
    <section
      className={`text-(length:--font_size_base) ${bodyAlignment}`}
      style={
        {
          "--font_size_base": `${font_size_base}pt`,
        } as React.CSSProperties
      }
    >
      {/* Section Title */}
      <h2
        className={`text-(length:--h2-size) font-bold ${titleAlignment}`}
        style={
          {
            "--h2-size": `${font_size_base * font_scale_curve.h2}pt`,
          } as React.CSSProperties
        }
      >
        {dbSection.title}
      </h2>

      {templateData.default_config.decorations.section_divider && (
        <DividerItem templateData={templateData} />
      )}

      {liveSections[dbSection.id].map((liveSubSection) => (
        <div key={liveSubSection.id}>
          {/* Sorted Section Fields */}
          {dbSection.fields
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <p key={field.id}>{liveSubSection.fields[field.id]}</p>
            ))}

          {/* Section Bullets */}
          <ul
            className="list-[var(--bullet-style)] list-inside pl-8"
            style={
              {
                "--bullet-style":
                  templateData.default_config.decorations.bullet_style,
              } as React.CSSProperties
            }
          >
            {liveSubSection.bullets.map((bullet) => (
              <li key={bullet.id}>
                {bullet.text}

                {/* Bullet's Sub Bullets */}
                <ul
                  className="list-[var(--sub-bullet-style)] list-inside pl-8"
                  style={
                    {
                      "--sub-bullet-style":
                        templateData.default_config.decorations
                          .sub_bullet_style,
                    } as React.CSSProperties
                  }
                >
                  {bullet.subBullets.map((subBullet) => (
                    <li key={subBullet.id}>{subBullet.text}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};
