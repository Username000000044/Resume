import { Field, FieldLabel } from "#/components/ui/field";
import { HexColorInput } from "react-colorful";
import { SquareColorPicker, type ColorPickerProps } from "./SquareColorPicker";

interface ColorPickerFieldProps extends ColorPickerProps {
    fieldLabel: string,
}

export const ColorPickerField = ({ className, fieldLabel, inputColor, defaultColor, handleColorChange }: ColorPickerFieldProps) => {

    return <Field className="gap-0">
        <FieldLabel className="font-normal">{fieldLabel}</FieldLabel>
        <div className="relative flex items-center">
            <HexColorInput
                prefixed={true}
                color={inputColor}
                onChange={handleColorChange}
                onDoubleClick={() => handleColorChange(defaultColor)}
                className="h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-base transition-[color,box-shadow] duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
            />

            <SquareColorPicker
                inputColor={inputColor}
                defaultColor={defaultColor}
                handleColorChange={handleColorChange}
                className={className}
            />
        </div>
    </Field>
};

