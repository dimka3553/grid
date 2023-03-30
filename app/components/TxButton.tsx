import { BigNumber } from "ethers";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ABI, contract } from "../../constants";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import Confetti from "./Confetti";
import { toast } from "react-toastify";

type TxButtonProps = {
  id: number;
  color: string;
  message: string;
  price: BigNumber;
};

export default function TxButton({ id, color, message, price }: TxButtonProps) {
  const addRecentTransaction = useAddRecentTransaction();
  const { config } = usePrepareContractWrite({
    abi: ABI,
    address: contract,
    functionName: "buyBox",
    //remove # from color and add 0x to the front
    args: [id, `0x${color.substring(1)}`, message],
    overrides: {
      value: price,
    },
  });

  const {
    write: buyBox,
    data: txData,
    isLoading: started,
    reset,
    isSuccess: loading,
  } = useContractWrite(config);

  const {
    data: tx,
    isLoading: txLoading,
    isSuccess: txSuccess,
  } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      reset();
      addRecentTransaction({
        hash: txData?.hash as string,
        description: `Bought box #${id + 1}`,
      });
      Confetti();
      toast.success("Box bought successfully!");
    },
  });

  return (
    <button
      className="bg-primary text-white text-lg font-bold rounded-md h-[44px] w-full flex items-center justify-center scale-sm disabled:opacity-50 disabled:scale-100"
      onClick={() => buyBox?.()}
      disabled={started || loading}
    >
      {started && "Waiting for approval..."}
      {loading && "Buying..."}
      {!started && !loading && "Buy Box"}
    </button>
  );
}
