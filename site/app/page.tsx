'use client';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { useAccount, useFeeData, useEstimateGas } from "wagmi";
import React, { useState } from "react";


// Utility function to convert wei (BigInt) to ETH (string)
function weiToEth(wei?: bigint) {
  if (!wei) return "-";
  return (Number(wei) / 1e18).toFixed(6); // 6 decimals for display
}

export default function Home() {
  const { isConnected, address, chain } = useAccount();
  const [sample, setSample] = useState(0);
  const [recipient, setRecipient] = useState<string>("");
  const [estimateValue, setEstimateValue] = useState<bigint | null>(null);
  const [trigger, setTrigger] = useState(0);

  // Get current gas price and related fee data
  const { data: feeData } = useFeeData({ chainId: chain?.id });
  // Helper to get a valid address for 'to'
  const getToAddress = () => {
    if (recipient && recipient.startsWith("0x") && recipient.length === 42) return recipient;
    if (address && address.startsWith("0x") && address.length === 42) return address;
    return undefined;
  };

  // Estimate gas for a transaction with the sample value (in ETH)
  const {
    data: gasLimit,
    isLoading: isEstimating,
    error: estimateError,
  } = useEstimateGas({
    to: getToAddress(),
    value: estimateValue ?? 0n,
    chainId: chain?.id,
    enabled: Boolean(getToAddress() && chain?.id && estimateValue !== null && trigger > 0),
  });
  // Calculate total fee if both are available
  const totalFee =
    feeData?.gasPrice && gasLimit ? feeData.gasPrice * gasLimit : undefined;
  // Handler for button click
  const handleEstimate = () => {
    try {
      const valueInWei = BigInt(Math.floor(Number(sample) * 1e18));
      setEstimateValue(valueInWei);
      setTrigger((t) => t + 1);
    } catch (e) {
      setEstimateValue(0n);
      setTrigger((t) => t + 1);
    }
  };
  console.log("feeData", feeData, "gasLimit", gasLimit, "totalFee", totalFee);
  return (
    <main className="">
      <div className="flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
        <Hero />

        <Separator className="w-full my-14 opacity-15" />

        <section className="flex flex-col items-center md:flex-row gap-10 w-full justify-center max-w-5xl">
          <Card className="relative bg-indigo-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none w-full max-w-xl self-start">
            <div className="bg-indigo-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
            <div className="bg-indigo-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
            <CardHeader>
              <CardTitle className="text-2xl">Gas fee calculator:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-7">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Chain - {chain?.id}</h3>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={sample}
                      onChange={(e) => setSample(Number(e.target.value))}
                      className="rounded px-2 py-1 text-black"
                      placeholder="Sample ETH amount"
                    />
                    <input
                      type="text"
                      value={recipient}
                      onChange={e => setRecipient(e.target.value)}
                      className="rounded px-2 py-1 text-black"
                      placeholder="Recipient address (optional)"
                    />
                    <button
                      onClick={handleEstimate}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                      disabled={!isConnected || !(recipient || address) || !chain?.id}
                    >
                      Estimate Gas Fee
                    </button>
                  </div>
                  {isEstimating && <div>Estimating gas...</div>}
                  {estimateError && <div className="text-red-400">Error: {estimateError.message}</div>}
                  <div>Gas Price: {feeData?.gasPrice?.toString() || "-"}</div>
                  <div>Gas Limit: {gasLimit?.toString() || "-"}</div>
                  <div>Total Fee: {totalFee?.toString() || "-"} wei ({weiToEth(totalFee)} ETH)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
