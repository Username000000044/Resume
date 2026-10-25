import { useResumeSectionsStore } from "#/store/useResumeSectionsStore";

import { LivePaper } from "../../Paper";
import { LiveSortableSectionItem } from "./LiveSortableSectionItem";
import type { SectionType, TemplateType } from "#/types/template";
import { type CSSProperties } from "react";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { useShallow } from "zustand/react/shallow";
import { LiveHeaderItem } from "./LiveHeaderItem";

interface LivePreviewProps {
  pageSectionsId: string[]; // ["sectionId", "sectionId"]
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

export const LivePagePreview = ({ templateData, pageSectionsId }: LivePreviewProps) => {
  // Stores
  const config = useResumeConfigStore((store) => store.config);
  const { sections } = useResumeSectionsStore(
    useShallow((state) => ({
      sections: state.sections,
    })),
  );

  if (!sections) return <div>Loading template live preview...</div>;

  //Spacing
  const page_margin = config.templateConfig.spacing.page_margin;

  // Typography
  const font_size_base = config.templateConfig.theme.typography.font_size_base;
  const font_scale_curve =
    PRESET_MAP[config.templateConfig.theme.typography.preset].scale_curve;


  return (
    <LivePaper
      className="text-(length:--font-size-base) "
    >
      <ul className="flex flex-col gap-[var(--section-gap)]">
        {pageSectionsId
          .map((sectionId) => {
            const dbSectionIndex = templateData.sections.findIndex(s => s.id === sectionId);
            const dbSection = templateData.sections[dbSectionIndex];

            if (!dbSection) return null;

            if (dbSection.isHeader) return <LiveHeaderItem dbSection={dbSection} key={sectionId} />

            return <LiveSortableSectionItem dbSectionIndex={dbSectionIndex} templateData={templateData} dbSection={dbSection} key={sectionId} />;
          })}
      </ul>
    </LivePaper>
  );
};
