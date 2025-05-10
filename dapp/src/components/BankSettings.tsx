"use client";

// import { useState } from "react";
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
import { Button } from "./ui/button";

export function BankSettings({ className }: { className?: string }) {
  // const [strict, setStrict] = useState(true);
  // const [functional, setFunctional] = useState(false);
  // const [performance, setPerformance] = useState(false);

  return (
    <Card className={cn("bg-card flex flex-col items-center", className)}>
      <CardHeader className="w-full text-left pb-2">
        <CardTitle>Crypto saving settings</CardTitle>
        <CardDescription>Manage your saving roundups here.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full gap-6">
        <div className="flex items-start">
          <Label
            className="flex flex-col items-start gap-[0.5rem] cursor-pointer select-none"
            htmlFor="byTransaction"
          >
            <span className="font-medium text-white">DCA on spending</span>
            <div className="text-muted-foreground text-sm font-light leading-[1.2rem]">
              Automatically round up every expense to buy crypto.
            </div>
          </Label>
          <Switch id="byTransaction" defaultChecked />
        </div>
        <div className="flex items-start">
          <Label
            className="flex flex-col items-start gap-[0.5rem] cursor-pointer select-none"
            htmlFor="byTime"
          >
            <span className="font-medium text-white">Scheduled DCA</span>
            <div className="text-muted-foreground text-sm font-light leading-[1.2rem]">
              Schedule your DCA plan to buy crypto.
            </div>
          </Label>
          <Switch id="byTime" defaultChecked />
        </div>
        <Button
        // className="mt-2 w-full border border-white/10 bg-black/30 text-white rounded-lg py-3 font-medium text-lg hover:bg-black/40 transition"
        >
          Save preferences
        </Button>
      </CardContent>
    </Card>
  );
}
