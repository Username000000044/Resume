import { ConfigData } from "@/ResumeRenderEngine";
import { FieldColor } from "@resume/frontend/src/types/trpc";
import { CSSProperties, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Field } from "./ui/field";
import { Avatar, AvatarGroup } from "./ui/avatar";

interface ColorPicker {
    triggerSizePx: number;
    colors: ConfigData["template"]["theme"]["colors"];
    inputColor: string;
    defaultInputColor: string;
    handleColorChange: (newColor: string) => void;
}

export const ResumeColorPicker = ({ triggerSizePx, colors, inputColor, defaultInputColor, handleColorChange }: ColorPicker) => {
    const [color, setColor] = useState(inputColor);

    const uninqueColors = useMemo(() => {
        return [...new Set(Object.values(colors))];
    }, [colors]);


    const handleLocalColorChange = (newColor: string) => {
        handleColorChange(newColor);
        setColor(newColor);
    };

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <button
                        type="button"
                        className={"bg-(--square-color) size-(--square-size) rounded-2xl ring-3 ring-input/20 shadow-md cursor-pointer"}
                        style={
                            {
                                "--square-size": `${triggerSizePx}px`,
                                "--square-color": color,
                            } as CSSProperties
                        }
                    />
                }
            />
            <PopoverContent className="w-min">
                <HexColorPicker
                    color={color}
                    onChange={setColor}
                    onChangeEnd={handleLocalColorChange}
                />
                <Field className="gap-0">
                    <HexColorInput
                        prefixed={true}
                        color={color}
                        onChange={handleLocalColorChange}
                        onDoubleClick={() => handleLocalColorChange(defaultInputColor)}
                        className="h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-base transition-[color,box-shadow] duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
                    />
                </Field>

                <AvatarGroup className="flex flex-wrap gap-1 justify-center">
                    {uninqueColors.map((color) => (
                        <Avatar
                            key={color}
                            className="after:border-0 bg-(--avatar-color)"
                            onClick={() => handleLocalColorChange(color)}
                            style={
                                {
                                    "--avatar-color": color,
                                } as React.CSSProperties
                            }
                        />
                    ))}
                </AvatarGroup>
            </PopoverContent>
        </Popover>
    );
}