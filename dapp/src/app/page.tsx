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
import { useEffect } from "react";
import { useGetBalances } from "@/hooks/api/useGetBalances";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 *
 * TODO:
 * 1. Implement loaders
 * 2. Handle Errors
 * 3. Fix Grid
 * 4. fix shadows
 * 6. implement hovers
 * 7. landing
 * 8. fake shop
 * 9. ai
 * 10. enhance big screens
 *
 */

export default function Home() {
  const { isConnected, address } = useAccount();

  const isTablet = useIsMobile(1160);
  const isMobile = useIsMobile(890);

  const { isLoading, data: balances } = useGetBalances(address);
  const isLoadingBalances = !address || isLoading;

  useEffect(() => {
    if (isConnected) {
      // getAddress()
    }
  }, [isConnected]);
  return (
    <div className="px-4 py-6 w-full flex flex-col gap-4">
      <div className="flex justify-start h-[40px]">
        <ConnectKitButton
          customTheme={{
            "--ck-connectbutton-border-radius": "14px",
          }}
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] auto-rows-auto gap-4">
        <NumberBlock
          className="h-fit row-span-1"
          description="Card account balance"
          value={balances?.card || 0}
          isLoading={isLoadingBalances}
        />
        <NumberBlock
          className="h-fit row-span-1"
          description="DCA account balance"
          value={balances?.dca_current || 0}
          isLoading={isLoadingBalances}
        />
        <NumberBlock
          className="min-[1160px]:h-fit row-span-1"
          description="Total Saved Funds"
          value={balances?.dca_total || 0}
          isLoading={isLoadingBalances}
        />
        <RecentTransactions
          isMobile={isTablet}
          className="min-w-[360px] h-fit w-full cols-span-1 min-[1160px]:col-span-2 row-span-2"
        />
        <BankSettings className="min-w-[320px] min-[1160px]:max-w-[480px]" />
        {!isTablet && <Banner className="min-[1160px]:h-full" />}
      </div>
      <div className={cn("grid grid-cols-3 gap-4", isTablet && "grid-cols-2")}>
        <div className="flex flex-col col-span-2 gap-4">
          <Chart className="w-full col-span-2 row-span-1" />
          <WithdrawBox className="col-start-1 row-start-2 w-full" />
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          {isTablet && <Banner className="min-[1160px]:h-full" />}
          <CarouselTokens className="h-[unset]" />
          <SavingsGoal className="h-fit w-full col-start-3" />
        </div>
      </div>
    </div>
  );
}
