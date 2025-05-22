"use client";

import { Chart } from "@/components/Chart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { SavingsGoal } from "@/components/SavingsGoal";
import { BankSettings } from "@/components/BankSettings";
import NumberBlock from "@/components/NumberBlock";
import Banner from "@/components/Banner";
import WithdrawBox from "@/components/WithdrawBox";
import { ConnectKitButton } from "connectkit";
import CarouselTokens from "@/components/CarouselTokens";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useGetBalances } from "@/hooks/api/useGetBalances";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Progress } from "@/components/ui/progress";
// import { ContainerTextFlip } from "@/components/ui/animations/TextFlip";
import {
  createAccount,
  usePrepareAccount,
} from "@/hooks/api/usePrepareAccount";

/**
 *
 * TODO:
 * 1. Implement loaders
 * 2. Handle Errors
 * 4. fix shadows
 * 6. implement hovers
 * 7. landing
 * 8. fake shop
 * 9. ai
 *
 */

export default function Home() {
  const { isConnected, address, chainId } = useAccount();

  const isTablet = useIsMobile(1160);
  // const isMobile = useIsMobile(890);

  // TODO: check fetches
  const [sessionId] = useState<string | null>(null);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setSessionId(localStorage.getItem(SIWE_SESSION_ID));
  //   }
  // }, []);
  const { isLoading, data: balances, isError } = useGetBalances();

  const { data: accountPrepared } = usePrepareAccount(
    address,
    sessionId || "",
    Number(chainId)
  );
  const isLoadingBalances = !address || isLoading || isError;

  const [creationProgress, setCreationProgress] = useState("");

  useEffect(() => {
    console.log("accountPrepared", address, accountPrepared);
    if (!address) return;
    if (
      accountPrepared?.status === "not_found" ||
      accountPrepared?.status === "creating"
    ) {
      const checkStatusInterval = setInterval(() => {
        createAccount(address!, sessionId || "", chainId || 1).then((data) => {
          console.log(data.status);
          if (data.status === "done" || data.status === "error") {
            clearInterval(checkStatusInterval);
          }
          if (data.status === "done") {
            setCreationProgress("done");
          }
        });
      }, 3000);
    }
  }, [
    isConnected,
    address,
    accountPrepared,
    creationProgress,
    sessionId,
    chainId,
  ]);

  return (
    <div className="flex flex-col gap-4 px-4 py-6 w-full">
      <div className="flex justify-start h-[40px]">
        <ConnectKitButton
          customTheme={{
            "--ck-connectbutton-border-radius": "14px",
          }}
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
        <NumberBlock
          className="row-span-1 h-fit"
          description="Card account balance"
          value={balances?.card || 0}
          isLoading={isLoadingBalances}
          address={accountPrepared?.safes?.card}
        />
        <NumberBlock
          className="row-span-1 h-fit"
          description="DCA account balance"
          value={balances?.dca_current || 0}
          isLoading={isLoadingBalances}
          address={accountPrepared?.safes?.dca}
        />
        <NumberBlock
          className="min-[1160px]:h-fit row-span-1"
          description="Total Saved Funds"
          value={balances?.dca_total || 0}
          isLoading={isLoadingBalances}
          address={accountPrepared?.safes?.reserve}
        />
        <RecentTransactions
          isMobile={isTablet}
          className="min-w-[320px] h-fit w-full cols-span-1 min-[1160px]:col-span-2 row-span-2"
        />
        <BankSettings className="min-w-[320px] min-[1160px]:max-w-[480px]" />
        {!isTablet && <Banner className="min-[1160px]:h-full" />}
      </div>
      <div className={cn("grid grid-cols-3 gap-4", isTablet && "grid-cols-2")}>
        <div className="flex flex-col col-span-2 gap-4">
          <Chart className="col-span-2 row-span-1 w-full" />
          <WithdrawBox className="col-start-1 row-start-2 w-full" />
        </div>

        <div className="flex flex-col col-span-1 gap-4">
          {isTablet && <Banner className="min-[1160px]:h-full" />}
          <CarouselTokens className="h-[unset]" />
          <SavingsGoal className="col-start-3 w-full h-fit" />
        </div>
      </div>

      {/* <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hold on, we are preparing everything</DialogTitle>
            <DialogDescription>
              This action cannot be skipped.
            </DialogDescription>
          </DialogHeader>
          <ContainerTextFlip
            words={[
              "Preparing...",
              "Creating safe account...",
              "Creating AAVE",
            ]}
            className="text-card-foreground"
          />
          <Progress value={50} />
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
