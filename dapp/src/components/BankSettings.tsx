"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function BankSettings({ className }: { className?: string }) {
  const [strict, setStrict] = useState(true);
  const [functional, setFunctional] = useState(false);
  const [performance, setPerformance] = useState(false);

  return (
    <Card className={cn("bg-card flex flex-col items-center", className)}>
      <CardHeader className="w-full text-left pb-2">
        <CardTitle>Piggy Bank Settings</CardTitle>
        <CardDescription>Manage your saving roundups here.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full gap-6">
        <div>
          {/* TODO: remove */}
          <div className="flex items-center">
            <Label
              className="flex flex-col items-start gap-3 cursor-pointer select-none"
              htmlFor="from-deposit"
            >
              <span className="font-semibold text-white">From deposits</span>
              <div className="text-muted-foreground text-sm">
                Automatically send 10% of each card income to a savings account.
              </div>
            </Label>
            <Switch id="from-deposit" />
          </div>
        </div>
        <div>
          {/* TODO: implement icons */}
          <label className="flex items-center gap-4 cursor-pointer select-none">
            <div className="flex-1">
              <span className="font-semibold text-white">
                Roundup expenses{" "}
              </span>
              <div className="text-muted-foreground text-sm">
                Automatically round up every expense to the nearest whole
                number.
              </div>
            </div>
            <button
              role="switch"
              aria-checked={functional}
              tabIndex={0}
              onClick={() => setFunctional(!functional)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition bg-black/40 border border-white/10 ${
                functional ? "bg-white/10" : ""
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                  functional ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-4 cursor-pointer select-none">
            <div className="flex-1">
              <span className="font-semibold text-white">Planned round up</span>
              <div className="text-muted-foreground text-sm">
                Automatically round up your balance to the nearest whole number
                every day.
              </div>
            </div>
            <button
              role="switch"
              aria-checked={performance}
              tabIndex={0}
              onClick={() => setPerformance(!performance)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition bg-black/40 border border-white/10 ${
                performance ? "bg-white/10" : ""
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                  performance ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>
        <button className="mt-2 w-full border border-white/10 bg-black/30 text-white rounded-lg py-3 font-medium text-lg hover:bg-black/40 transition">
          Save preferences
        </button>
      </CardContent>
    </Card>
  );
}
