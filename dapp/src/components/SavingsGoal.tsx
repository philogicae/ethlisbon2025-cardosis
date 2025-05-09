"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function SavingsGoal({ className }: { className?: string }) {
  const [goal, setGoal] = useState(300);
  const min = 100;
  const max = 1000;
  const step = 10;
  const bars = [50, 30, 40, 35, 50, 45, 30, 25, 40, 35, 50, 45]; // Example data

  return (
    <Card className={cn("bg-card flex flex-col items-center p-6", className)}>
      <CardHeader className="w-full text-center pb-2">
        <CardTitle className="text-white text-lg">Move Goal</CardTitle>
        <CardDescription>Set your deposit goal.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center w-full gap-4">
        <div className="flex items-center justify-center gap-8 my-2">
          <button
            className="rounded-full w-10 h-10 flex items-center justify-center text-2xl bg-muted/20 hover:bg-muted/30 transition"
            onClick={() => setGoal((g) => Math.max(g - step, min))}
            aria-label="Decrease goal"
          >
            –
          </button>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-white">{goal}</span>
            <span className="uppercase tracking-widest text-xs text-muted-foreground">
              €/day
            </span>
          </div>
          <button
            className="rounded-full w-10 h-10 flex items-center justify-center text-2xl bg-muted/20 hover:bg-muted/30 transition"
            onClick={() => setGoal((g) => Math.min(g + step, max))}
            aria-label="Increase goal"
          >
            +
          </button>
        </div>
        <div className="flex items-end justify-center gap-1 h-16 w-full max-w-xs mx-auto">
          {bars.map((v, i) => (
            <div
              key={i}
              className="rounded bg-white/90"
              style={{ width: 12, height: v }}
            />
          ))}
        </div>
        <Button className="mt-4 w-full text-black rounded-lg py-3 text-lg hover:bg-gray-100 transition">
          Set Goal
        </Button>
      </CardContent>
    </Card>
  );
}
