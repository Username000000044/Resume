import { useResumeStore } from "#/store/useResumeStore";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../../backend/src/appRouter";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "../../ui/empty";
import { LivePaper } from "../../Paper";
import { SortableSectionItem } from "./SortableSectionItem";
import { HeaderItem } from "./HeaderItem";

interface templateData {
  templateData: inferRouterOutputs<AppRouter>["templateById"];
}

export const SCALE_CURVES = {
  editorial: { h3: 1.25, h2: 1.6, h1: 2.5, line_height: 1.45 },
  balanced: { h3: 1.15, h2: 1.35, h1: 2.0, line_height: 1.4 },
  minimal: { h3: 1.05, h2: 1.15, h1: 1.5, line_height: 1.34 },
} as const;

export const TEXT_ALIGNMENT = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const LiveTemplate = ({ templateData }: templateData) => {
  const liveSections = useResumeStore((store) => store.liveMainSections);

  if (!liveSections) return <div>Loading template live preview...</div>;

  const templateIsEmpty = templateData.sections.every((section) => {
    const liveMainSection = liveSections[section.id] || [];

    return liveMainSection.every((subSection) => {
      const fieldsEmpty = section.fields.every(
        (field) => subSection.fields[field.id] === "",
      );

      const bulletsEmpty = subSection.bullets.every(
        (bullet) =>
          bullet.text === "" &&
          bullet.subBullets.every((subBullet) => subBullet.text === ""),
      );

      return fieldsEmpty && bulletsEmpty;
    });
  });

  if (templateIsEmpty)
    return (
      <LivePaper className="flex justify-center items-center">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Empty Template</EmptyTitle>
            <EmptyDescription>
              Begin completing each section to populate the live preview.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </LivePaper>
    );

  //Spacing
  const page_margin = templateData.default_config.spacing.page_margin;
  const line_height =
    SCALE_CURVES[templateData.default_config.theme.typography.scale_curve]
      .line_height;

  // Typography
  const font_size_base =
    templateData.default_config.theme.typography.font_size_base;
  const font_scale_curve =
    SCALE_CURVES[templateData.default_config.theme.typography.scale_curve];

  return (
    <div className="flex flex-col gap-8 w-full">
      <LivePaper
        className="flex flex-col text-(length:--font_size_base) gap-[var(--section-gap)] leading-[var(--line-height)] !p-[var(--page-margin)]"
        style={
          {
            // Typography
            "--font_size_base": `${font_size_base}pt`,
            "--h1-size": `${font_size_base * font_scale_curve.h1}pt`,
            "--h2-size": `${font_size_base * font_scale_curve.h2}pt`,
            "--h3-size": `${font_size_base * font_scale_curve.h3}pt`,

            // Spacing
            "--page-margin": `${page_margin}in`,
            "--section-gap": `${templateData.default_config.spacing.section_gap}pt`,
            "--instance-gap": `${templateData.default_config.spacing.instance_gap}pt`,
            "--divider-gap": `${templateData.default_config.spacing.divider_gap}pt`,
            "--line-height": `${font_size_base * line_height}pt`,

            // Decorations
            "--bullet-style":
              templateData.default_config.decorations.bullet_style,
            "--sub-bullet-style":
              templateData.default_config.decorations.sub_bullet_style,
            "--divider-color": templateData.default_config.theme.colors.divider,
          } as React.CSSProperties
        }
      >
        {/* Header */}
        {/* {templateData.sections
          .filter((dbSection) => dbSection.order === 1)
          .map((dbSection) => (
            <HeaderItem
              templateData={templateData}
              dbSection={dbSection}
              key={dbSection.id}
            />
          ))} */}

        {/* Sections */}
        <div className="flex flex-col gap-[var(--section-gap)]">
          {templateData.sections
            .filter((dbSection) => dbSection.order !== 1)
            .map((dbSection) => (
              <SortableSectionItem
                templateData={templateData}
                dbSection={dbSection}
                key={dbSection.id}
              />
            ))}
        </div>
      </LivePaper>
      <LivePaper />
    </div>
  );
};
