import { useContractRead, useAccount } from "wagmi";
import { ABI, contract } from "../../constants";
import { BigNumber, utils } from "ethers";

type HistoryProps = {
  id: number;
};

type Box = {
  owner: `0x${string}`;
  price: BigNumber;
  color: `0x${string}`;
  message: string;
  timestamp: BigNumber;
};

function lastPrice(wei: BigNumber): number {
  return parseFloat((parseFloat(utils.formatEther(wei)) / 1.2).toFixed(4));
}

export default function History({ id }: HistoryProps) {
  const { data, isLoading } = useContractRead({
    abi: ABI,
    address: contract,
    functionName: "getBoxHistory",
    args: [id],
    watch: true,
  });

  const smAcc = (account: string) => {
    return `${account.substring(0, 5)}...${account.substring(38, 42)}`;
  };

  if (isLoading) return null;

  const history = data as Box[];

  return (
    <div>
      {history.length !== 0 && (
        <>
          {" "}
          <h3 className="text-lg font-bold">Purchase History</h3>
          {[...history].reverse().map((box, index) => {
            const { owner, price, color, message, timestamp } = box;
            return (
              <div key={index} className="py-3 flex flex-col gap-2">
                <div className="flex items-center gap-3 ">
                  <div
                    className="w-5 h-5 min-w-5 min-h-5 rounded-md"
                    style={{ backgroundColor: `#${box.color.substring(2)}` }}
                  ></div>
                  <p className="font-bold text-md">
                    #{box.color.substring(2).toUpperCase()} @{" "}
                    {lastPrice(box.price)} BNB
                  </p>
                </div>

                <p className="break-words">{box.message}</p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
