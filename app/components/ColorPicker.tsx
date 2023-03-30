import * as Popover from "@radix-ui/react-popover";
import { ChromePicker } from "react-color";

type ColorPickerProps = {
  color: string;
  setColor: (color: string) => void;
};

export default function ColorPicker({ color, setColor }: ColorPickerProps) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <div
          className="w-5 h-5 min-w-5 min-h-5 rounded-md"
          style={{ backgroundColor: `${color}` }}
        ></div>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal className="">
        <Popover.Content className="z-[95390]">
          <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
