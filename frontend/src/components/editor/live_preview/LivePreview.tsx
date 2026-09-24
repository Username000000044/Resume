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
import { Fragment, type CSSProperties } from "react";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { DragDropProvider } from "@dnd-kit/react";
import { useShallow } from "zustand/react/shallow";

interface LivePreviewProps {
  templateData: TemplateType;
}

export const PRESET_MAP = {
  editorial: {
    scale_curve: {
      h1: 2.5,
      h2: 1.6,
      h3: 1.25,
      h4: 1.05,
      p: 1,
      span: 1,
      li: 1,
    },
    line_height: {
      h1: 1.05,
      h2: 1.1,
      h3: 1.2,
      h4: 1.35,
      p: 1.5,
      span: 1.5,
      li: 1.5,
    },
  },
  balanced: {
    scale_curve: {
      h1: 2.0,
      h2: 1.35,
      h3: 1.15,
      h4: 1.0,
      p: 1,
      span: 1,
      li: 1,
    },
    line_height: {
      h1: 1.1,
      h2: 1.15,
      h3: 1.25,
      h4: 1.35,
      p: 1.5,
      span: 1.5,
      li: 1.5,
    },
  },
  minimal: {
    scale_curve: {
      h1: 1.5,
      h2: 1.15,
      h3: 1.05,
      h4: 0.95,
      p: 1,
      span: 1,
      li: 1,
    },
    line_height: {
      h1: 1.2,
      h2: 1.25,
      h3: 1.3,
      h4: 1.35,
      p: 1.5,
      span: 1.5,
      li: 1.5,
    },
  },
} as const;

export const ALIGNMENT_MAP = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const LivePreview = ({ templateData }: LivePreviewProps) => {
  const { config, liveMode, defaultConfig } = useResumeConfigStore(
    useShallow((state) => ({
      config: state.config,
      defaultConfig: state.defaultConfig,
      liveMode: state.liveMode,
    })),
  );
  const { sections, reorderSections } = useResumeStore(
    useShallow((state) => ({
      sections: state.sections,
      reorderSections: state.reorderSections,
    })),
  );

  if (!sections) return <div>Loading template live preview...</div>;

  const templateIsEmpty = templateData.sections.every((dbSection) => {
    const liveMainSection = sections[dbSection.id] || [];

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
    const liveMainSection = sections[dbSection.id] || { subSections: [] };

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
  const page_margin = config.templateConfig.spacing.page_margin;

  // Typography
  const font_size_base = config.templateConfig.theme.typography.font_size_base;
  const font_scale_curve =
    PRESET_MAP[config.templateConfig.theme.typography.preset].scale_curve;

  const dynamicPreviewStyles = {
    // Typography
    "--font-size-base": `${font_size_base}pt`,
    "--section-title-size": `${font_size_base * font_scale_curve.h2}pt`,

    // Spacing
    "--page-margin": `${page_margin}in`,
    "--section-gap": `${config.templateConfig.spacing.section_gap}pt`,
    "--instance-gap": `${config.templateConfig.spacing.instance_gap}pt`,
    "--divider-gap": `${config.templateConfig.spacing.divider_gap}pt`,
    "--group-gap": `${config.templateConfig.spacing.group_gap}pt`,
    "--bullet-indentation": `${config.templateConfig.spacing.bullet_indentation}pt`,

    // Decorations
    "--bullet-style": config.templateConfig.decorations.bullet_style,
    "--sub-bullet-style": config.templateConfig.decorations.sub_bullet_style,

    //Colors (Field colors are handled dynamically in the LiveFieldItem component)
    "--divider-color": config.templateConfig.theme.colors.divider,
    "--header-color": config.templateConfig.theme.colors.heading,
    "--section-title_color": config.templateConfig.theme.colors.section_title,
    "--bullet-color": config.templateConfig.theme.colors.body,

    //Weight (Field weight are handled dynamically in the LiveFieldItem componet)
    "--header-weight":
      config.templateConfig.theme.typography.font_weight.heading,
    "--section-title-weight":
      config.templateConfig.theme.typography.font_weight.section_title,
    "--bullet-weight": config.templateConfig.theme.typography.font_weight.body,
  } as CSSProperties;

  return (
    <LivePaper
      className="relative flex flex-col text-(length:--font-size-base) !p-[var(--page-margin)]"
      style={dynamicPreviewStyles}
    >
      {/* Header */}
      <div className="pb-[var(--section-gap)]">
        {templateData.sections
          .filter((dbSection) => {
            const isHeaderSection = dbSection.order === 0;
            const sectionHasContents = !sectionIsEmpty(dbSection);

            return isHeaderSection && sectionHasContents;
          })
          .map((dbSection) => (
            <LiveHeaderItem dbSection={dbSection} key={dbSection.id} />
          ))}
      </div>

      {/* Sections */}
      <DragDropProvider
        onDragEnd={(event) => {
          const sectionId = event.operation.target?.id;

          if (sectionId) {
            reorderSections(event);
          }
        }}
      >
        <ul className="flex flex-col gap-[var(--section-gap)]">
          {templateData.sections
            .filter((dbSection) => {
              const isNotHeaderSection = dbSection.order !== 0;
              const sectionHasContents = !sectionIsEmpty(dbSection);

              return isNotHeaderSection && sectionHasContents;
            })
            .sort((a, b) => sections[a.id].order - sections[b.id].order)
            .map((dbSection, dbSectionIndex) => (
              <LiveSortableSectionItem
                key={dbSection.id}
                templateData={templateData}
                dbSection={dbSection}
                dbSectionIndex={dbSectionIndex}
              />
            ))}
        </ul>
      </DragDropProvider>
    </LivePaper>
  );
};
