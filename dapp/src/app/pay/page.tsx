"use client";
import React from "react";
import Image from "next/image";
import cardImage from "@/app/assets/card.webp"; // Path relative to your project structure
import { useMockPayMutation, useMockPay } from "@/hooks/api/useMockPay";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";

const Pay = () => {
  const { address, chainId } = useAccount();
  const { mutate, data } = useMockPayMutation();
  const { isLoading, isError } = useMockPay(address, chainId);
  console.log(data);
  return (
    <div className="my-8 mx-4">
      <ConnectKitButton />
      <h1 className="mb-4 text-2xl font-bold">Pay with Gnosis card:</h1>
      <div
        className="flex items-center justify-center mb-6 rounded-[30px] overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition"
        onClick={() => mutate({ address, chainId })}
      >
        <Image src={cardImage} alt="pay" width={500} height={500} />
      </div>
      {isLoading && <h2>Processing...</h2>}
      {data?.status === "ok" && <h2>Success</h2>}
      {(data?.status === "error" || isError) && <h2>Something went wrong</h2>}
    </div>
  );
};

export default Pay;
