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
  return (
    <div className="px-4 py-6 w-full flex flex-col gap-4">
      <div className="flex justify-start h-[40px]">
        <ConnectKitButton
          customTheme={{
            "--ck-connectbutton-border-radius": "14px",
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <NumberBlock
          className="h-fit col-span-1"
          description="Total Saved Funds"
          value={230}
        />
        <NumberBlock
          className="h-fit col-span-1"
          description="Interest earned"
          value={112}
        />
        <div
          className={`col-start-3 row-start-1 row-span-2
                      flex flex-col gap-4`}
        >
          <BankSettings className="min-w-[320px] max-w-[480px] h-fit" />
          <Banner className="h-full" />
          <NumberBlock
            className="h-fit"
            description="DCA account balance"
            value={394}
          />
        </div>
        <Chart className="w-full col-span-2 row-start-2 grid-row-[1/-1]" />
        {/* <RecentTransactions className="min-w-[360px] col-span-1 col-start-3 row-start-2" /> */}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 flex gap-4">
          <WithdrawBox />
          <SavingsGoal className="h-fit w-full" />
        </div>
        <div className="col-start-3 flex flex-col gap-4">
          <NumberBlock
            className="h-fit"
            description="Card account balance"
            value={180}
          />
          <CarouselTokens className="flex-1" />
        </div>
        <RecentTransactions className="min-w-[360px] col-span-2 row-start-2" />
      </div>
      {/* <div className="flex flex-wrap md:flex-nowrap gap-4">
        <Chart className="w-full" />
        <BankSettings className="min-w-[320px] max-w-[480px] h-fit" />
      </div> */}
      {/* <div className="grid grid-cols-3 grid-rows-2 gap-4 grid-rows-[auto_1fr]">
        <NumberBlock
          className="h-fit col-span-1"
          description="Total Saved Funds"
          value={230}
        />
        <NumberBlock
          className="h-fit col-span-1"
          description="Interest earned"
          value={112}
        />
        <Banner className="col-span-1" />
        <RecentTransactions className="min-w-[360px] col-span-2 row-start-2" />
        <div className="row-start-2 col-start-3 flex flex-col gap-4">
          <NumberBlock
            className="h-fit"
            description="Card account balance"
            value={180}
          />
          <NumberBlock
            className="h-fit"
            description="DCA account balance"
            value={394}
          />
          <CarouselTokens className="flex-1" />
        </div>
      </div> */}
      {/* <div className="flex gap-4">
        <WithdrawBox />
        <SavingsGoal className="h-fit" />
      </div> */}
    </div>
  );
}
