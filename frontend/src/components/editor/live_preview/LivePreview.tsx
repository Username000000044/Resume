import { useResumeStore } from "#/store/useResumeStore";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "../../ui/empty";
import { LivePaper } from "../../Paper";
import { LiveSortableSectionItem } from "./LiveSortableSectionItem";
import type { SectionType, TemplateType } from "#/types/Template";
import { LiveHeaderItem } from "./LiveHeaderItem";
import type { CSSProperties } from "react";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { DragDropProvider } from "@dnd-kit/react";
import { useShallow } from "zustand/react/shallow";

interface LivePreviewProps {
  templateData: TemplateType;
}

export const SCALE_CURVES = {
  editorial: {
    h1: 2.5,
    h2: 1.6,
    h3: 1.25,
    h4: 1.05,
    p: 1,
    span: 1,
    line_height: 1.45,
  },
  balanced: {
    h1: 2.0,
    h2: 1.35,
    h3: 1.15,
    h4: 1.0,
    p: 1,
    span: 1,
    line_height: 1.4,
  },
  minimal: {
    h1: 1.5,
    h2: 1.15,
    h3: 1.05,
    h4: 0.95,
    p: 1,
    span: 1,
    line_height: 1.34,
  },
} as const;

export const ALIGNMENT_MAP = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const LivePreview = ({ templateData }: LivePreviewProps) => {
  const { liveSections, reorderSections } = useResumeStore(
    useShallow((state) => ({
      liveSections: state.liveMainSections,
      reorderSections: state.reorderSections,
    })),
  );

  if (!liveSections) return <div>Loading template live preview...</div>;

  const templateIsEmpty = templateData.sections.every((dbSection) => {
    const liveMainSection = liveSections[dbSection.id] || [];

    return liveMainSection.subSections.every((subSection) => {
      const fieldsEmpty = dbSection.fields.every(
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

  const sectionIsEmpty = (dbSection: SectionType) => {
    const liveMainSection = liveSections[dbSection.id] || { subSections: [] };

    return liveMainSection.subSections.every((subSection) => {
      const fieldsEmpty = dbSection.fields.every(
        (field) => subSection.fields[field.id] === "",
      );

      const bulletsEmpty = subSection.bullets.every(
        (bullet) =>
          bullet.text === "" &&
          bullet.subBullets.every((subBullet) => subBullet.text === ""),
      );

      return fieldsEmpty && bulletsEmpty;
    });
  };

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

  const dynamicPreviewStyles = {
    // Typography
    "--font-size-base": `${font_size_base}pt`,
    "--section-title-size": `${font_size_base * font_scale_curve.h2}pt`,

    // Spacing
    "--page-margin": `${page_margin}in`,
    "--section-gap": `${templateData.default_config.spacing.section_gap}pt`,
    "--instance-gap": `${templateData.default_config.spacing.instance_gap}pt`,
    "--divider-gap": `${templateData.default_config.spacing.divider_gap}pt`,
    "--separator-gap": `${templateData.default_config.spacing.separator_gap}pt`,
    "--bullet-indentation": `${templateData.default_config.spacing.bullet_indentation}pt`,
    "--line-height": `${font_size_base * line_height}pt`,

    // Decorations
    "--bullet-style": templateData.default_config.decorations.bullet_style,
    "--sub-bullet-style":
      templateData.default_config.decorations.sub_bullet_style,

    //Colors (Field colors are handled dynamically in the LiveFieldItem component)
    "--divider-color": templateData.default_config.theme.colors.divider,
    "--header-color": templateData.default_config.theme.colors.heading,
    "--section-title_color":
      templateData.default_config.theme.colors.section_title,
    "--bullet-color": templateData.default_config.theme.colors.body,

    //Weight (Field weight are handled dynamically in the LiveFieldItem componet)
    "--header-weight":
      templateData.default_config.theme.typography.font_weight.heading,
    "--section-title-weight":
      templateData.default_config.theme.typography.font_weight.section_title,
    "--bullet-weight":
      templateData.default_config.theme.typography.font_weight.body,
  } as CSSProperties;

  return (
    <div className="flex flex-col gap-4 w-full" style={dynamicPreviewStyles}>
      <LivePaper className="flex flex-col text-(length:--font-size-base) leading-[var(--line-height)] !p-[var(--page-margin)]">
        {/* Header */}
        <div className="pb-[var(--section-gap)]">
          {templateData.sections
            .filter((dbSection) => {
              const isHeaderSection = dbSection.order === 0;
              const sectionHasContents = !sectionIsEmpty(dbSection);

              return isHeaderSection && sectionHasContents;
            })
            .map((dbSection) => (
              <LiveHeaderItem
                templateData={templateData}
                dbSection={dbSection}
                key={dbSection.id}
              />
            ))}
        </div>

        <DragDropProvider
          onDragEnd={(event) => {
            const sectionId = event.operation.target?.id;

            if (sectionId) {
              reorderSections(event);
            }
          }}
        >
          {/* Sections */}
          <ul className="flex flex-col gap-[var(--section-gap)]">
            {templateData.sections
              .filter((dbSection) => {
                const isNotHeaderSection = dbSection.order !== 0;
                const sectionHasContents = !sectionIsEmpty(dbSection);

                return isNotHeaderSection && sectionHasContents;
              })
              .sort(
                (a, b) => liveSections[a.id].order - liveSections[b.id].order,
              )
              .map((dbSection, dbSectionIndex) => (
                <LiveSortableSectionItem
                  templateData={templateData}
                  dbSection={dbSection}
                  dbSectionIndex={dbSectionIndex}
                  key={dbSection.id}
                />
              ))}
          </ul>
        </DragDropProvider>
      </LivePaper>
      <LivePaper />
    </div>
  );
};
