"use client";

import Image from "next/image";
import { useAccount, useBalance } from "wagmi";

export const Hero = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: chain?.id,
  });

  if (isConnected) {
    return (
      <section className="relative mx-auto mt-28">
        <h1 className="text-3xl text-zinc-100 font-bold">Welcome, {address}!</h1>
        <h3 className="text-2xl text-white opacity-70 text-center mt-4">
          Connected to: <strong>{chain?.name}</strong>
        </h3>
        <h3 className="text-2xl text-white opacity-70 text-center mt-4">
          Balance:{" "}
          <strong>
            {balance ? `${balance.formatted} ${balance.symbol}` : "Loading..."}
          </strong>
        </h3>
      </section>
    );
  }

  return (
    <section className="relative mx-auto mt-28">
      <h1 className="text-7xl text-zinc-100 font-bold">Welcome</h1>
      <p className="text-white opacity-70 text-center text-lg">
        to the <strong>MetaMask SDK</strong> quick start app!
        <br /> Connect your wallet to get started.
      </p>
      <Image
        src="/arrow.svg"
        alt="Arrow pointing to the connect wallet button"
        className="absolute hidden md:block md:bottom-5 md:-right-48"
        width={150}
        height={150}
      />
    </section>
  );
};
