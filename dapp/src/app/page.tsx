"use client";

import { Chart } from "@/components/Chart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { SavingsGoal } from "@/components/SavingsGoal";
import { BankSettings } from "@/components/BankSettings";
import NumberBlock from "@/components/NumberBlock";
import Banner from "@/components/Banner";
import WithdrawBox from "@/components/WithdrawBox";
import { ConnectKitButton } from "connectkit";

/**
 *
 * TODO:
 * 1. Implement loaders
 * 2. Handle Errors
 * 3. Fix Grid
 * 4. fix shadows
 * 5. deploy
 * 6. implement hovers
 *
 */

export default function Home() {
  return (
    <div className="px-4 py-6 w-full flex flex-col gap-4">
      <ConnectKitButton />
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <Chart className="w-full" />
        <BankSettings className="min-w-[320px] max-w-[480px] h-fit" />
      </div>
      <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-3 auto-rows-auto">
        <NumberBlock
          className="md:col-span-1"
          description="Total Saved Funds"
          value={230}
        />
        <NumberBlock
          className="md:col-span-1"
          description="Interest earned"
          value={112}
        />
        {/* TODO card account balance */}
        {/* TODO DCA account balance*/}
        {/* TODO prices for some tokens CoinGecko */}
        <Banner />
        <RecentTransactions className="min-w-[360px] md:col-span-2" />
        <SavingsGoal className="md:col-span-1 h-fit" />
        <WithdrawBox />
      </div>
    </div>
  );
}
