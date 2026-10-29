import type { TemplateConfig, SectionConfig, SectionType } from "@resume/frontend/src/types/trpc";
import type { SectionData } from "@resume/frontend/src/store/useResumeSectionsStore";
import type { Mode, ValueType } from "@resume/frontend/src/store/useResumeConfigStore";
import { ResumeSection } from "./components/ResumeSection";
import { ResumePage } from "./components/ResumePage";
import { createContext, CSSProperties } from "react";
import { PageSize, pageSizeMap, scalePresetMap } from "./constants";
import { ResumeHeader } from "./components/ResumeHeader";
import { ConfigChangeContext } from "./context/ConfigChangeContext";
import { Dimensions } from "@resume/frontend/src/store/useResumeDimensionsStore";
import { ResumePageScaleWrapper } from "./components/ResumePageScaleWrapper";
import { DimensionsChangeContext } from "./context/DimensionsChangeContext";


export interface ConfigData {
    template: TemplateConfig;
    sections: Record<string, SectionConfig>;
}

interface Settings {
    pageSize: PageSize;
    scale?: number;
    pageGapPx?: number;
    sectionControls?: boolean;
    pagination?: boolean;
}

interface RenderEngineProps {
    dbSections: SectionType[];
    sections: Record<string, SectionData>;
    defaultConfig: ConfigData;
    config: ConfigData;
    mode: Mode;
    pages: string[][];
    settings: Settings;
    onConfigChange: (path: string[], value: ValueType) => void;
    onSectionDimensionsChange: (sectionId: string, dimensions: Dimensions) => void;
}

export const ResumeRenderEngine = (props: RenderEngineProps) => {
    const { dbSections, sections, config, defaultConfig, pages, mode, onConfigChange, onSectionDimensionsChange } = props;
    const { scale = 1, pageGapPx = 0, sectionControls = false, pagination = true, pageSize } = props.settings;

    const templateConfig = config.template;

    const font_size_base = templateConfig.theme.typography.font_size_base;
    const font_scale_curve = scalePresetMap[templateConfig.theme.typography.preset].scale_curve;

    const pageStyles = {
        // Page
        "--page-width": `${pageSizeMap[pageSize].w}in`,
        "--page-height": `${pageSizeMap[pageSize].h}in`,
        "--page-gap": `${pageGapPx}px`,

        // Typography
        "--font-size-base": `${font_size_base}pt`,
        "--section-title-size": `${font_size_base * font_scale_curve.h2}pt`,

        // Spacing
        "--page-margin": `${templateConfig.spacing.page_margin}in`,
        "--section-gap": `${templateConfig.spacing.section_gap}pt`,
        "--instance-gap": `${templateConfig.spacing.instance_gap}pt`,
        "--divider-gap": `${templateConfig.spacing.divider_gap}pt`,
        "--group-gap": `${templateConfig.spacing.group_gap}pt`,
        "--bullet-indentation": `${templateConfig.spacing.bullet_indentation}pt`,

        // Decorations
        "--bullet-style": templateConfig.decorations.bullet_style,
        "--sub-bullet-style": templateConfig.decorations.sub_bullet_style,

        // Colors (Text colors are handled dynamically in the Text component)
        "--divider-color": templateConfig.theme.colors.divider,
        "--header-color": templateConfig.theme.colors.heading,
        "--section-title_color": templateConfig.theme.colors.section_title,
        "--bullet-color": templateConfig.theme.colors.body,
        "--separator-color": templateConfig.theme.colors.body,

        // Weight (Text weight are handled dynamically in the Text componet)
        "--header-weight":
            templateConfig.theme.typography.font_weight.heading,
        "--section-title-weight":
            templateConfig.theme.typography.font_weight.section_title,
        "--bullet-weight": templateConfig.theme.typography.font_weight.body,
    } as CSSProperties;

    /* Pages 
    const pages = [
        ["sectionId"], ["sectionId"]
        ["sectionId"]
    ]
    */

    console.log(pages)

    return (
        <ConfigChangeContext value={onConfigChange}>
            <DimensionsChangeContext value={onSectionDimensionsChange}>
                <div style={pageStyles} className="flex flex-col gap-(--page-gap)">
                    {pages.length === 0 && (
                        <ResumePageScaleWrapper pageSize={pageSize} scale={scale}>
                            <ResumePage hasContent={false} pagination={pagination} />
                        </ResumePageScaleWrapper>
                    )}

                    {pagination ? (
                        pages.map((page, pageNum) => (
                            <ResumePageScaleWrapper pageSize={pageSize} scale={scale} key={`page-${pageNum}`}>
                                <ResumePage hasContent={true} pagination={pagination}>
                                    {page.map(sectionId => {
                                        const dbSectionIdx = dbSections.findIndex(s => s.id === sectionId);
                                        const dbSection = dbSections[dbSectionIdx];

                                        if (!dbSection) return null;

                                        if (dbSection.isHeader) return <ResumeHeader
                                            section={sections[dbSection.id]}
                                            dbSection={dbSection}
                                            defaultConfig={defaultConfig}
                                            config={config}
                                            mode={mode}
                                            key={sectionId}
                                        />

                                        return <ResumeSection
                                            key={sectionId}
                                            section={sections[dbSection.id]}
                                            dbSection={dbSection}
                                            defaultConfig={defaultConfig}
                                            config={config}
                                            mode={mode}
                                        />
                                    })}
                                </ResumePage>
                            </ResumePageScaleWrapper>
                        ))
                    ) : (
                        <ResumePageScaleWrapper pageSize={pageSize} scale={scale}>
                            <ResumePage hasContent={true} pagination={pagination}>
                                {pages.flat().map((sectionId) => {
                                    const dbSectionIdx = dbSections.findIndex(s => s.id === sectionId);
                                    const dbSection = dbSections[dbSectionIdx];

                                    if (!dbSection) return null;

                                    if (dbSection.isHeader) return <ResumeHeader
                                        section={sections[dbSection.id]}
                                        dbSection={dbSection}
                                        defaultConfig={defaultConfig}
                                        config={config}
                                        mode={mode}
                                        key={sectionId}
                                    />

                                    return <ResumeSection
                                        key={sectionId}
                                        section={sections[dbSection.id]}
                                        dbSection={dbSection}
                                        defaultConfig={defaultConfig}
                                        config={config}
                                        mode={mode}
                                    />
                                })}
                            </ResumePage>
                        </ResumePageScaleWrapper>
                    )}
                </div>
            </DimensionsChangeContext>
        </ConfigChangeContext>
    )
}