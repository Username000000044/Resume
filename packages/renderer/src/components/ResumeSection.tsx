import { SectionData } from "@resume/frontend/src/store/useResumeSectionsStore";
import { FieldType, SectionType } from "@resume/frontend/src/types/trpc";
import { ConfigData } from "../ResumeRenderEngine";
import { Mode } from "@resume/frontend/src/store/useResumeConfigStore";
import { ResumeText } from "./ResumeText";
import { getElementProperties } from "@/utils/getElementProperties";
import { ResumeDivider } from "./ResumeDivider";
import { BarScrubber } from "./ui/bar-scrubber";
import { INSTANCE_GAP_SCRUBBER, SECTION_GAP_SCRUBBER } from "@/limits";
import { useContext } from "react";
import { ConfigChangeContext } from "@/context/ConfigChangeContext";
import { constructLayoutMatrix } from "@/utils/constructLayoutMatrix";
import { ResumeGroupWrapper } from "./ResumeGroupWrapper";
import { DimensionsChangeContext } from "@/context/DimensionsChangeContext";
import { useResizeObserver } from "@/hooks/useResizeObserver";

interface SectionProps {
    dbSection: SectionType;
    section: SectionData;
    defaultConfig: ConfigData;
    config: ConfigData;
    mode: Mode;
}

export const ResumeSection = ({ dbSection, section, defaultConfig, config, mode }: SectionProps) => {
    const setSectionDimensions = useContext(DimensionsChangeContext);

    const { targetRef } = useResizeObserver((width, height) => {
        setSectionDimensions(dbSection.id, { width, height })
    })

    const hasSectionDivier = config.template.decorations.section_divider;

    const defaultDividerGap = defaultConfig.template.spacing.divider_gap;
    const defaultSectionGap = defaultConfig.template.spacing.section_gap;
    const defaultInstanceGap = defaultConfig.template.spacing.instance_gap;

    const dividerGap = config.template.spacing.divider_gap;
    const sectionGap = config.template.spacing.section_gap;
    const instanceGap = config.template.spacing.instance_gap;

    const dividerStyle = config.template.decorations.divider_style;

    const updateProperty = useContext(ConfigChangeContext);

    const handleSectionGapChange = (value: number) => {
        updateProperty(["template", "spacing", "section_gap"], value);
    };
    const handleSectionGapReset = () => {
        updateProperty(["template", "spacing", "section_gap"], defaultSectionGap);
    };
    const handleInstanceGapChange = (value: number) => {
        updateProperty(["template", "spacing", "instance_gap"], value);
    };
    const handleInstanceGapReset = () => {
        updateProperty(["template", "spacing", "instance_gap"], defaultInstanceGap);
    };

    return (
        <section className="relative pt-(--section-gap)" ref={targetRef}>
            {/* Section Gap Bar */}
            {mode === "editor" && (
                <div className="absolute top-0 translate-y-0 w-full">
                    <BarScrubber
                        scrollDirection="vertical"
                        value={sectionGap ?? 0}
                        onChange={handleSectionGapChange}
                        onDoubleClick={handleSectionGapReset}
                        min={SECTION_GAP_SCRUBBER.MIN}
                        max={SECTION_GAP_SCRUBBER.MAX}
                        step={SECTION_GAP_SCRUBBER.STEP}
                    />
                </div>
            )}

            {/* Section Title */}
            <ResumeText
                config={config.template}
                defaultConfig={defaultConfig.template}
                mode={mode}
                properties={getElementProperties("title", config.template)}
                value={dbSection.title}
            />

            {/* Section Divider */}
            {hasSectionDivier && <ResumeDivider dividerGap={dividerGap} defaultDividerGap={defaultDividerGap} dividerStyle={dividerStyle} mode={mode} />}

            {/* Section Content */}
            <div className="flex flex-col gap-(--instance-gap)">
                {section.subSections.map((subSection) => {
                    const matrix = constructLayoutMatrix(dbSection.fields);

                    const isNotFirstSubSection = subSection.order !== 0;

                    // Formats Input Field Value
                    const formatFieldValue = (field: FieldType) => {
                        const value = subSection.fields[field.id];

                        const currrentRowIndex = field.alignment?.rowIndex ?? 0;
                        const currentItemOrder = field.alignment?.itemOrder ?? 0;

                        // Safe extraction of previous item
                        const previousFieldInRow =
                            matrix[currrentRowIndex]?.[currentItemOrder - 1];

                        // Location Alterations
                        if (field.name.includes("location") && value) {
                            if (
                                previousFieldInRow &&
                                previousFieldInRow.alignment?.position ===
                                field.alignment?.position &&
                                subSection.fields[previousFieldInRow.id]
                            ) {
                                return `, ${value}`;
                            }
                        }

                        // Date Alterations
                        if (field.type === "date" && value) {
                            const rawInputDate = new Date(`${value}T23:59:59`);
                            const rawTodayDate = new Date();
                            const formattedInputDate = formatDate(rawInputDate);

                            if (
                                previousFieldInRow &&
                                previousFieldInRow.type === "date" &&
                                subSection.fields[previousFieldInRow.id]
                            ) {
                                return rawInputDate.valueOf() > rawTodayDate.valueOf()
                                    ? "—Present"
                                    : `—${formattedInputDate}`;
                            }

                            return rawInputDate.valueOf() > rawTodayDate.valueOf()
                                ? "Present"
                                : formattedInputDate;
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
                        <div key={subSection.id} className="relative">
                            {/* Instance Gap Bar */}
                            {mode === "editor" && isNotFirstSubSection && (
                                <div className="absolute -top-(--instance-gap) -translate-y-(--instance_gap) w-full">
                                    <BarScrubber
                                        scrollDirection="vertical"
                                        value={instanceGap ?? 0}
                                        onChange={handleInstanceGapChange}
                                        onDoubleClick={handleInstanceGapReset}
                                        min={INSTANCE_GAP_SCRUBBER.MIN}
                                        max={INSTANCE_GAP_SCRUBBER.MAX}
                                        step={INSTANCE_GAP_SCRUBBER.STEP}
                                    />
                                </div>
                            )}

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
                            <ul className="list-(--bullet-style) text-(--bullet-color) font-(--bullet-weight) pl-(--bullet-indentation) list-inside">
                                {subSection.bullets.map((bullet) => (
                                    <span key={bullet.id}>
                                        <ResumeText
                                            key={bullet.id}
                                            config={config.template}
                                            defaultConfig={defaultConfig.template}
                                            mode={mode}
                                            properties={getElementProperties("bullet", config.template)}
                                            value={bullet.text}
                                        />

                                        {/* Bullet's Sub Bullets */}
                                        <ul className="flex flex-col items-start list-(--sub-bullet-style) pl-(--bullet-indentation) list-inside">
                                            {bullet.subBullets.map((subBullet) => (
                                                <ResumeText
                                                    key={subBullet.id}
                                                    config={config.template}
                                                    defaultConfig={defaultConfig.template}
                                                    mode={mode}
                                                    properties={getElementProperties("bullet", config.template)}
                                                    value={subBullet.text}
                                                />
                                            ))}
                                        </ul>
                                    </span>
                                ))}

                            </ul>

                        </div>
                    );
                })}
            </div>

        </section>
    );
}


const formatDate = (unformattedDate: Date) => {
    const month = unformattedDate.toLocaleDateString("default", {
        month: "long",
    });
    const year = unformattedDate.getFullYear();

    return `${month}\u00A0${year}`;
};
