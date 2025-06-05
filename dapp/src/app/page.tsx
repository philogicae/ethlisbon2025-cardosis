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
import {
  createAccount,
  usePrepareAccount,
} from "@/hooks/api/usePrepareAccount";
import { useAppStore } from "@/stores/useAppStore";
import Navigation from "@/components/Navigation";
import OnBoardingModal from "@/components/OnBoardingModal";

/**
 *
 * TODO:
 * 1. Implement loaders
 * 2. Handle Errors
 * 4. fix shadows
 * 6. implement hovers
 * 7. landing
 * 8. fake shop
 * 10. mobile
 * 11. onboarding
 *
 */

export default function Home() {
  const { isConnected } = useAccount();
  const { sessionId, address, chainId } = useAppStore();

  const [showOnBoarding, setShowOnBoarding] = useState(false);
  const [onBoardingDone, setOnBoardingDone] = useState(false);

  const isTablet = useIsMobile(1160);
  // const isMobile = useIsMobile(890);

  const { isLoading, data: balances, isError } = useGetBalances();

  const { data: accountPrepared } = usePrepareAccount();
  const isLoadingBalances = !address || isLoading || isError;

  const [creationProgress, setCreationProgress] = useState("");

  useEffect(() => {
    if (!address) return;
    if (accountPrepared?.status === "created") {
      useAppStore.setState({ isCreated: true });
      setOnBoardingDone(true);
    }
    if (
      accountPrepared?.status === "not_found" ||
      accountPrepared?.status === "creating"
    ) {
      setShowOnBoarding(true);
      const checkStatusInterval = setInterval(() => {
        createAccount(/* TODO Check registartion later */).then((data) => {
          console.log("Account creation status:", data);
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
      <div className="flex justify-start h-[40px] gap-4">
        <Navigation className="sm:hidden" />
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
          {!isTablet && (
            <div className="flex flex-col flex-wrap col-span-1 gap-4">
              <Banner className="min-[1160px]:h-full" />
              <CarouselTokens className="h-[unset]" />
              <SavingsGoal className="col-start-3 w-full h-fit" />
            </div>
          )}
        </div>

        {isTablet && (
          <div className="flex flex-col flex-wrap col-span-2 gap-4">
            <Banner className="min-[1160px]:h-full" />
            <CarouselTokens className="h-[unset]" />
            <SavingsGoal className="col-start-3 w-full h-fit" />
          </div>
        )}
      </div>
      <OnBoardingModal open={showOnBoarding} isDone={onBoardingDone} />
    </div>
  );
}
