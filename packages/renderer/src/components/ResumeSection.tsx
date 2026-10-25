import { SectionData } from "@resume/frontend/src/store/useResumeSectionsStore";
import { SectionType } from "@resume/frontend/src/types/trpc";
import { ConfigData } from "../ResumeRenderEngine";
import { Mode } from "@resume/frontend/src/store/useResumeConfigStore";
import { ResumeText } from "./ResumeText";
import { getElementProperties } from "@/utils/getElementProperties";
import { ResumeDivider } from "./ResumeDivider";

interface SectionProps {
    dbSection: SectionType;
    section: SectionData;
    defaultConfig: ConfigData;
    config: ConfigData;
    mode: Mode;
}

export const ResumeSection = ({ dbSection, section, defaultConfig, config, mode }: SectionProps) => {

    const hasSectionDivier = config.template.decorations.section_divider;

    const defaultDividerGap = defaultConfig.template.spacing.divider_gap;
    const dividerStyle = config.template.decorations.divider_style;


    return (
        <section>
            {/* Section Title */}
            <ResumeText
                config={config.template}
                defaultConfig={defaultConfig.template}
                mode={mode}
                properties={getElementProperties("title", config.template)}
                value={dbSection.title}
            />

            {/* Section Divider */}
            {hasSectionDivier && <ResumeDivider defaultDividerGap={defaultDividerGap} dividerStyle={dividerStyle} mode={mode} />}




        </section>
    )
}
