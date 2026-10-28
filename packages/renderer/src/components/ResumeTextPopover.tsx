import { ReactNode, useContext, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Mode } from "@resume/frontend/src/store/useResumeConfigStore";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./ui/card";
import { elementNameMap } from "@/constants";
import { FieldElement, FieldType } from "@resume/frontend/src/types/trpc";
import { ConfigChangeContext } from "@/context/ConfigChangeContext";
import { ConfigData } from "@/ResumeRenderEngine";
import { ResumeColorPicker } from "./ResumeColorPicker";
import { Field, FieldLabel } from "./ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FONT_VARIANTS } from "@resume/backend/src/db/schema.js";
import { NumericScrubber } from "./ui/number-scrubber";
import { FONT_WEIGHT_SCRUBBER } from "@/limits";


interface Item {
    label: string;
    value: string;
}

const variants: Item[] = FONT_VARIANTS.map((variant) => ({
    label: variant.charAt(0).toUpperCase() + variant.slice(1),
    value: variant,
}));


interface TextPopover {
    mode: Mode;
    trigger: ReactNode;

    colors: ConfigData["template"]["theme"]["colors"];

    fieldElementName: string;
    fieldRole: string;
    fieldColor: string;

    fontVariant: typeof FONT_VARIANTS[number];
    fontWeight: number;

    defaultFieldColor: string;
    defaultFontWeight: number;
}

export const ResumeTextPopover = (props: TextPopover) => {
    const { mode, trigger, colors, fieldElementName, fieldRole, fontVariant, fontWeight, fieldColor, defaultFieldColor, defaultFontWeight } = props;

    const updateProperty = useContext(ConfigChangeContext);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedFontVariant, setSelectedFontVariant] = useState(fontVariant);

    const handleColorChange = (newColor: string) => {
        updateProperty(["template", "theme", "colors", fieldRole], newColor);
    };
    const handleWeightChange = (value: number) => {
        updateProperty(["template", "theme", "typography", "font_weight", fieldRole], value);
    };
    const handleWeightReset = () => {
        updateProperty(["template", "theme", "typography", "font_weight", fieldRole], defaultFontWeight)
    };

    return <Popover
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
                    {trigger}
                </button>
            }
        />
        <PopoverContent
            side="bottom"
            className="p-0 w-80"
            onPointerDown={(event) => {
                event.stopPropagation();
            }}
        >
            <Card className="shadow-none ring-0">
                <CardHeader>
                    <CardTitle>
                        {fieldElementName} Element
                    </CardTitle>
                    <CardAction>
                        <ResumeColorPicker
                            triggerSizePx={28}
                            inputColor={fieldColor}
                            defaultInputColor={defaultFieldColor}
                            handleColorChange={handleColorChange}
                            colors={colors}
                        />
                    </CardAction>
                </CardHeader>
                <CardContent className="flex gap-3">
                    <Field className="gap-0">
                        <FieldLabel className="font-normal">Primary Font</FieldLabel>
                        <Select
                            items={variants}
                            value={selectedFontVariant}
                            onValueChange={(value) => {
                                if (!value) return;

                                setSelectedFontVariant(value);
                                updateProperty(
                                    [
                                        "template",
                                        "theme",
                                        "typography",
                                        "font_family",
                                        fieldRole,
                                    ],
                                    value,
                                );
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {variants.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field className="gap-0">
                        <FieldLabel className="font-normal">Font Weight</FieldLabel>
                        <NumericScrubber
                            hasIcon={true}
                            iconOrientation="horizontal"
                            scrollDirection="horizontal"
                            value={fontWeight ?? 0}
                            onChange={handleWeightChange}
                            onDoubleClick={handleWeightReset}
                            step={FONT_WEIGHT_SCRUBBER.STEP}
                            min={FONT_WEIGHT_SCRUBBER.MIN}
                            max={FONT_WEIGHT_SCRUBBER.MAX}
                        />
                    </Field>
                </CardContent>
            </Card>
        </PopoverContent>
    </Popover>
}