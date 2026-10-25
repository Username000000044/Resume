import { SectionData } from "@resume/frontend/src/store/useResumeSectionsStore";
import { ConfigData } from "../ResumeRenderEngine";
import { FieldType, SectionType } from "@resume/frontend/src/types/trpc";

import { constructLayoutMatrix } from "../utils/constructLayoutMatrix";
import { ResumeGroupWrapper } from "./ResumeGroupWrapper";
import { Mode } from "@resume/frontend/src/store/useResumeConfigStore";
import { getElementProperties } from "@/utils/getElementProperties";
import { ResumeText } from "./ResumeText";

interface HeaderProps {
    dbSection: SectionType;
    section: SectionData;
    defaultConfig: ConfigData;
    config: ConfigData;
    mode: Mode;
}

export const ResumeHeader = ({ dbSection, section, defaultConfig, config, mode }: HeaderProps) => {

    return (
        <section>
            <div className="flex flex-col gap-(--instance-gap)">
                {section.subSections.map((subSection) => {
                    const matrix = constructLayoutMatrix(dbSection.fields);

                    // Formats Input Field Value
                    const formatFieldValue = (field: FieldType) => {
                        const value = subSection.fields[field.id];

                        const currrentRowIndex = field.alignment?.rowIndex ?? 0;
                        const currentItemOrder = field.alignment?.itemOrder ?? 0;
                        const previousFieldInRow =
                            matrix[currrentRowIndex][currentItemOrder - 1];

                        // Heading Alterations
                        if (
                            previousFieldInRow &&
                            previousFieldInRow.renderRole === "heading"
                        ) {
                            return `\u00A0${value}`;
                        }

                        //Location Alterations
                        if (field.name.includes("location") && value) {
                            // Previous and current element are in the same position + previous item exists
                            if (
                                previousFieldInRow &&
                                previousFieldInRow.alignment?.position ===
                                field.alignment?.position &&
                                subSection.fields[previousFieldInRow.id]
                            ) {
                                return `,\u00A0${value}`;
                            }
                        }

                        return value;
                    };

                    const alignedRowItem = (rowIndex: number, alignment: "left" | "center" | "right") => {
                        const rawItems = matrix[rowIndex].filter(
                            (field) => field.alignment?.position === alignment,
                        );

                        const visibleItems = rawItems.filter((field) => {
                            const value = subSection.fields[field.id];
                            return value && value.trim() !== "";
                        });

                        return visibleItems.map((field, index) => {
                            const value = subSection.fields[field.id];

                            const showSeparator = index < visibleItems.length - 1;

                            const separator = config.template.decorations.group_separator;
                            const groupGap = config.template.spacing.group_gap;
                            const defaultGroupGap = defaultConfig.template.spacing.group_gap;

                            const colors = config.template.theme.colors;


                            return <ResumeGroupWrapper
                                key={field.id}
                                field={field}
                                value={value}
                                mode={mode}
                                groupGap={groupGap}
                                defaultGroupGap={defaultGroupGap}
                                separator={separator}
                                showSeparator={showSeparator}
                            >
                                <ResumeText
                                    mode={mode}
                                    config={config.template}
                                    defaultConfig={defaultConfig.template}
                                    value={formatFieldValue(field)}
                                    properties={getElementProperties(
                                        "field",
                                        config.template,
                                        field,
                                    )}
                                />
                            </ResumeGroupWrapper>
                        })
                    }

                    return (
                        <div key={subSection.id}>
                            {/* Row Index */}
                            {matrix.map((_, rowIndex) => (
                                <div
                                    key={matrix[rowIndex].map((field) => field.id).join("-")}
                                    className="grid grid-cols-[auto_auto_auto] items-top w-full"
                                >
                                    {/* Left Aligned */}
                                    <div className="flex justify-start">
                                        {alignedRowItem(rowIndex, "left")}
                                    </div>

                                    {/* Center Aligned */}
                                    <div className="flex justify-center">
                                        {alignedRowItem(rowIndex, "center")}
                                    </div>

                                    {/* Right Aligned */}
                                    <div className="flex justify-end">
                                        {alignedRowItem(rowIndex, "right")}
                                    </div>
                                </div>
                            ))}

                            {/* Section Bullets */}
                            {/* <ul className="list-[var(--bullet-style)] text-[var(--bullet-color)] font-[var(--bullet-weight)] list-inside pl-8">
                                {liveSubSection.bullets.map((bullet) => (
                                    <li key={bullet.id}>
                                        {bullet.text}

                                        <ul className="list-[var(--sub-bullet-style)] list-inside pl-8">
                                            {bullet.subBullets.map((subBullet) => (
                                                <li key={subBullet.id}>{subBullet.text}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul> */}
                        </div>
                    );
                })}
            </div>
        </section>
    )
}
