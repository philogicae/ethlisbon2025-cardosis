"use client";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartData = [
  { month: "January", saved: 186, gained: 186 },
  { month: "February", saved: 205, gained: 215 },
  { month: "March", saved: 237, gained: 250 },
  { month: "April", saved: 240, gained: 262 },
  { month: "May", saved: 247, gained: 292 },
  { month: "June", saved: 252, gained: 312 },
];

const chartConfig = {
  saved: {
    label: "Saved",
    color: "var(--chart-1)",
  },
  gained: {
    label: "Gained",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function Chart({ className }: { className?: string }) {
  return (
    <Card className={cn("w-1/2", className)}>
      <CardHeader>
        <CardTitle>Savings chart</CardTitle>
        <CardDescription>Track your savings progress</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillSaved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-saved)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-saved)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillGained" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-gained)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-gained)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="gained"
              type="natural"
              fill="url(#fillGained)"
              fillOpacity={0.4}
              stroke="var(--color-gained)"
              stackId="a"
              strokeWidth={4}
            />
            <Area
              dataKey="saved"
              type="natural"
              fill="url(#fillSaved)"
              fillOpacity={0.4}
              stroke="var(--color-saved)"
              stackId="a"
              strokeWidth={4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* TODO: Add tons of description */}
        <div className="flex gap-2 font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Showing progress for the last {6} months
        </div>
      </CardFooter>
    </Card>
  );
}
