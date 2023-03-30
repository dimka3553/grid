import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { BigNumber, utils } from "ethers";
import History from "./History";
import TextInput from "./Input";
import TxButton from "./TxButton";
import ColorPicker from "./ColorPicker";

type Box = {
  owner: `0x${string}`;
  price: BigNumber;
  color: `0x${string}`;
  message: string;
  timestamp: BigNumber;
};

type DialogProps = {
  trigger: React.ReactNode;
  title: string;
  id: number;
  box: Box;
};

export default function Drawer({
  trigger,
  title,
  id,
  box,
}: DialogProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#000000");
  const [message, setMessage] = useState("");

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let col = e.target.value;
    if (e.target.value[0] !== "#") {
      col = `#${col}`;
    }
    if (col.length > 7) {
      col = col.substring(0, 7);
    }

    if (!col.match(/^#[0-9a-fA-F]+$/)) {
      col = col.replace(/[^0-9a-fA-F]/g, "");
      col = `#${col}`;
    }

    setColor(col);
  };
  console.log(`0x${color.substring(1)}`);

  const handleColorRelease = (e: React.ChangeEvent<HTMLInputElement>) => {
    //if the color is is less than 7 characters, add 0s to the end
    if (e.target.value.length < 7) {
      let col = e.target.value;
      while (col.length < 7) {
        col += "0";
      }
      setColor(col);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let message = e.target.value;

    //if the message is over 128 bytes remove last character until it is 128 bytes
    let bytes = new TextEncoder().encode(message);
    while (bytes.length > 127) {
      message = message.substring(0, message.length - 1);
      bytes = new TextEncoder().encode(message);
    }
    const newMessage = new TextDecoder().decode(bytes);
    setMessage(newMessage);
  };

  const weiToEth = (wei: BigNumber) => {
    return utils.formatEther(wei);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <div className="flex items-center justify-between h-[74px] px-5 gap-5">
            <Dialog.Title className="text-lg font-bold truncate">
              {title}
            </Dialog.Title>
            <Dialog.Close className="DialogClose" asChild>
              <button className="bg-slate-100 h-[40px] w-[40px] min-h-[40px] min-w-[40px] rounded-full flex items-center justify-center scale">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="#0066ff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                    d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83"
                  ></path>
                </svg>
              </button>
            </Dialog.Close>
          </div>
          <div className="px-5 flex flex-col gap-5 pb-5 border-b-[1px] border-b-[#ddd] mb-5">
            <TextInput
              placeholder="Color (Hex)"
              label="New Color"
              unit={
                <ColorPicker color={color} setColor={(col) => setColor(col)} />
              }
              value={color}
              onChange={(e) => handleColorChange(e)}
              onRelease={(e) => handleColorRelease(e)}
            />
            <TextInput
              placeholder="Message..."
              label="New Message"
              unit={"MSG"}
              value={message}
              onChange={(e) => handleMessageChange(e)}
              onRelease={(e) => setMessage(e.target.value)}
            />
            <div>
              <p className="text-sm font-bold text-slate-500">Price</p>
              <p className="text-xl text-primary font-medium">
                {weiToEth(box.price)} BNB
              </p>
            </div>
            {open && (
              <TxButton
                price={box.price}
                color={color}
                message={message}
                id={id}
              />
            )}
          </div>

          <div className="px-5">{open && <History id={id} />}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
