import { useState } from "react";
import Drawer from "~/components/Drawer";
import { BigNumber } from "ethers";
import { CSSProperties } from "react";
import { utils } from "ethers";

type Box = {
  owner: `0x${string}`;
  price: BigNumber;
  color: `0x${string}`;
  message: string;
  timestamp: BigNumber;
};

type BoxProps = {
  box: Box;
  index: number;
};

export default function Box({ box, index }: BoxProps) {
  const [hover, setHover] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  const hoverMessageStyle: CSSProperties = {
    position: "fixed",
    top: mousePosition.y,
    left: mousePosition.x,
    backgroundColor: "#f4f6f9",
    borderRadius: "4px",
    padding: "8px",
    zIndex: 1,
    pointerEvents: "none",
    maxWidth: "200px",
  };

  const weiToEth = (wei: BigNumber) => {
    return utils.formatEther(wei);
  };

  return (
    <Drawer
      trigger={
        <div onMouseMove={handleMouseMove}>
          {hover && (
            <div style={hoverMessageStyle}>
              <p className="break-words">{box.message}</p>
              <p className="font-bold">{weiToEth(box.price)} BNB</p>
            </div>
          )}

          <div
            style={{ backgroundColor: `#${box.color.substring(2)}` }}
            className="aspect-square scale cursor-pointer rounded-md border-[1px] border-[#333]"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          ></div>
        </div>
      }
      title={`Box #${index + 1}`}
      id={index}
      box={box}
    ></Drawer>
  );
}
