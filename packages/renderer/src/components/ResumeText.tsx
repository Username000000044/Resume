import { ConfigChangeContext } from "@/context/ConfigChangeContext";
import { Mode } from "@resume/frontend/src/store/useResumeConfigStore";
import { FieldColor, FieldElement, FieldHeight, FieldRole, FieldSize, FontVariant, FontWeight, TemplateConfig } from "@resume/frontend/src/types/trpc";
import { useContext, useState } from "react";
import { cn } from "../lib/utils";
import { ResumeTextPopover } from "./ResumeTextPopover";
import { elementNameMap } from "@/constants";

interface TextProps {
    config: TemplateConfig;
    defaultConfig: TemplateConfig;
    mode: Mode;
    value: string;
    properties: {
        fieldRole: FieldRole;
        fieldWeight: FontWeight;
        fieldColor: FieldColor;
        fieldSize: FieldSize;
        fieldHeight: FieldHeight;
        fontVariant: FontVariant;
        FieldElement: FieldElement;
    };
}

export const ResumeText = ({ config, defaultConfig, mode, value, properties }: TextProps) => {
    const fieldColor = config.theme.colors[properties.fieldRole];
    const defaultColor = defaultConfig.theme.colors[properties.fieldRole];

    const fontVariant = config.theme.typography.font_family[properties.fieldRole];
    const fontWeight = config.theme.typography.font_weight[properties.fieldRole];
    const defaultFontWeight = defaultConfig.theme.typography.font_weight[properties.fieldRole];

    const fontFamily =
        properties.fontVariant === "primary"
            ? config.theme.typography.primary_font_family
            : config.theme.typography.secondary_font_family;

    return (
        <ResumeTextPopover
            mode={mode}
            colors={config.theme.colors}

            fieldRole={properties.fieldRole}
            fieldColor={fieldColor}
            fieldElementName={elementNameMap[properties.FieldElement]}

            fontVariant={fontVariant}
            fontWeight={fontWeight}

            defaultFontWeight={defaultFontWeight}
            defaultFieldColor={defaultColor}

            trigger={
                <properties.FieldElement
                    className={cn(
                        "font-(--field-weight) text-(--field-color) leading-(--leading) text-(length:--field-size)",
                        {
                            "cursor-pointer hover:underline": mode === "editor",
                        },
                    )}
                    style={
                        {
                            "--field-weight": properties.fieldWeight,
                            "--field-color": properties.fieldColor,
                            "--field-size": `${properties.fieldSize}pt`,
                            "--leading": properties.fieldHeight, // multiplies by current size
                            fontFamily: `"${fontFamily}", sans-serif`,
                        } as React.CSSProperties
                    }
                >
                    {value}
                </properties.FieldElement>
            }
        />
    );
};
