import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface PopoverColorPicker {
  fieldColor: string; // hex
}

export const PopoverColorPicker = ({ fieldColor }: PopoverColorPicker) => {
  const config = useResumeConfigStore((store) => store.config);
  const [color, setColor] = useState("#ffffff");

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="size-8 rounded-md ring-3 ring-input/20 shadow-md cursor-pointer"
            style={
              {
                background: color,
              } as React.CSSProperties
            }
          />
        }
      />
      <PopoverContent className="p-0 w-auto">
        <HexColorPicker color={color} onChange={setColor} />
      </PopoverContent>
    </Popover>
  );
};
