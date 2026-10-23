import { SectionData } from "@resume/frontend/src/store/useResumeSectionsStore";
import { SectionType } from "@resume/frontend/src/types/trpc";
import { ConfigData } from "../ResumeRenderEngine";

interface SectionProps {
    dbSection: SectionType;
    section: SectionData;
    config: ConfigData;
}

export const ResumeSection = ({ config, dbSection, section }: SectionProps) => {
    return <p>hi</p>;
}
