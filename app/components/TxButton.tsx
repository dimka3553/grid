import { BigNumber } from "ethers";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { ABI, contract } from "../../constants";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import Confetti from "./Confetti";
import { toast } from "react-toastify";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type TxButtonProps = {
  id: number;
  color: string;
  message: string;
  price: BigNumber;
};

export default function TxButton({ id, color, message, price }: TxButtonProps) {
  const addRecentTransaction = useAddRecentTransaction();
  const { isConnected } = useAccount();
  const { config } = usePrepareContractWrite({
    abi: ABI,
    address: contract,
    functionName: "buyBox",
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

  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => {
          return (
            <button
              onClick={openConnectModal}
              className="bg-primary text-white text-lg font-bold rounded-md h-[44px] w-full flex items-center justify-center scale-sm disabled:opacity-50 disabled:scale-100"
              type="button"
            >
              Connect Wallet
            </button>
          );
        }}
      </ConnectButton.Custom>
    );
  }
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
