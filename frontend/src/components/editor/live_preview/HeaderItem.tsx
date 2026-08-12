import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../../backend/src/appRouter";
import { useResumeStore } from "#/store/useResumeStore";
import { SCALE_CURVES, TEXT_ALIGNMENT } from "./LiveTemplate";

type TemplateType = inferRouterOutputs<AppRouter>["templateById"];
type SectionType = TemplateType["sections"][number];

interface HeaderItemProps {
  templateData: TemplateType;
  dbSection: SectionType;
}

export const HeaderItem = ({ dbSection, templateData }: HeaderItemProps) => {
  const liveSections = useResumeStore((store) => store.liveMainSections);

  // Typography
  const font_size_base =
    templateData.default_config.theme.typography.font_size_base;
  const font_scale_curve =
    SCALE_CURVES[templateData.default_config.theme.typography.scale_curve];

  // Alignment
  const alignmentKey = templateData.default_config.alignment;
  const headerAlignment = TEXT_ALIGNMENT[alignmentKey.header];

  // Content
  //   const fullName = liveSections[dbSection.id][0].fields[]

  return (
    <section
      className={`text-(length:--font_size_base) ${headerAlignment}`}
      style={
        {
          "--font_size_base": `${font_size_base}pt`,
        } as React.CSSProperties
      }
    >
      {/* Header Title */}
      <h1
        className={`text-(length:--h1-size) font-bold`}
        style={
          {
            "--h1-size": `${font_size_base * font_scale_curve.h1}pt`,
          } as React.CSSProperties
        }
      >
        {dbSection.title}
      </h1>
      {liveSections[dbSection.id].map((liveSubSection) => (
        <div key={liveSubSection.id}>
          {/* Sorted Section Fields */}
          {dbSection.fields
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <p key={field.id}>{liveSubSection.fields[field.id]}</p>
            ))}

          {/* Section Bullets */}
          <ul className="list-disc list-inside pl-8">
            {liveSubSection.bullets.map((bullet) => (
              <li key={bullet.id}>
                {bullet.text}

                {/* Bullet's Sub Bullets */}
                <ul className="list-[circle] list-inside pl-8">
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
