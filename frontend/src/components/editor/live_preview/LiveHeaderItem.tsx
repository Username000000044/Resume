import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../../backend/src/appRouter";
import { useResumeStore } from "#/store/useResumeStore";
import type { SectionType, TemplateType } from "#/types/Template";

interface HeaderItemProps {
  templateData: TemplateType;
  dbSection: SectionType;
}

export const HeaderItem = ({ dbSection, templateData }: HeaderItemProps) => {
  const liveSections = useResumeStore((store) => store.liveMainSections);

  // Alignment
  const alignmentKey = templateData.default_config.alignment;
  const headerAlignment = TEXT_ALIGNMENT[alignmentKey.header];

  return (
    <section className={`text-(length:--font_size_base) ${headerAlignment}`}>
      {/* Header Title */}
      <h1 className={`text-(length:--h1-size) font-bold`}>{dbSection.title}</h1>
      {liveSections[dbSection.id].map((liveSubSection) => (
        <div key={liveSubSection.id} className="space-y-[var(--content-gap)]">
          {/* Sorted Section Fields */}
          {dbSection.fields
            // .sort((a, b) => a.order - b.order)
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
