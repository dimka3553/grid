import { contract, ABI } from "../../constants";
import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import Box from "~/components/Box";

type Box = {
  owner: `0x${string}`;
  price: BigNumber;
  color: `0x${string}`;
  message: string;
  timestamp: BigNumber;
};

export default function Index() {
  const { data, isLoading } = useContractRead({
    abi: ABI,
    address: contract,
    functionName: "getBoxes",
    watch: true,
  });

  if (isLoading) return null;

  const grid = data as Box[];

  return (
    <>
      <div className="grid grid-cols-8 gap-[2%]">
        {grid.map((box, index) => {
          return <Box key={index} index={index} box={box} />;
        })}
      </div>
    </>
  );
}
