import { ConfigChangeContext } from "@/context/ConfigChangeContext";
import { Mode } from "@resume/frontend/src/store/useResumeConfigStore";
import { FieldColor, FieldElement, FieldHeight, FieldRole, FieldSize, FontVariant, FontWeight, TemplateConfig } from "@resume/frontend/src/types/trpc";
import { useContext, useState } from "react";
import { cn } from "../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./ui/card";
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
    const updateProperty = useContext(ConfigChangeContext);

    const [isOpen, setIsOpen] = useState(false);

    const fieldColor = config.theme.colors[properties.fieldRole];
    const defaultColor = defaultConfig.theme.colors[properties.fieldRole];

    const handleColorChange = (newColor: string) => {
        updateProperty(["templateConfig", "theme", "colors", properties.fieldRole], newColor);
    };

    const fontFamily =
        properties.fontVariant === "primary"
            ? config.theme.typography.primary_font_family
            : config.theme.typography.secondary_font_family;

    return (
        <Popover
            open={isOpen}
            onOpenChange={(open) => {
                if (open && mode === "preview") {
                    return;
                }

                setIsOpen(open);
            }}
        >
            <PopoverTrigger
                render={
                    <button
                        type="button"
                        className="select-text cursor-text [text-align:inherit]"
                    >
                        <properties.FieldElement
                            className={cn(
                                "font-[var(--field-weight)] text-[var(--field-color)] leading-[var(--leading)] text-(length:--field-size)",
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
                    </button>
                }
            />
            <PopoverContent
                side="bottom"
                className="p-0 shadow-none w-80"
                onPointerDown={(event) => {
                    event.stopPropagation();
                }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {elementNameMap[properties.FieldElement]} Element
                        </CardTitle>
                        <CardAction>
                            {/* <SquareColorPicker
                                inputColor={fieldColor}
                                defaultColor={defaultColor}
                                handleColorChange={handleColorChange} /> */}
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        {/* <FieldConfig fieldRole={properties.fieldRole} /> */}
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>
    );
};
