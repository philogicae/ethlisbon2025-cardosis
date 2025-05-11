"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { useGetCharts } from "@/hooks/api/useGetCharts";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { SIWE_SESSION_ID } from "@/constants/storage";

const chartConfig = {
  card: {
    label: "Card",
    color: "var(--chart-1)",
  },
  dca: {
    label: "DCA",
    color: "var(--chart-3)",
  },
  reserve: {
    label: "Reserve",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const loadingData = [
  {
    card: 100,
    reserve: 200,
    dca: 5,
    timestamp: new Date().toISOString(),
  },
  {
    card: 200,
    reserve: 300,
    dca: 4,
    timestamp: new Date().toISOString(),
  },
];

export function Chart({ className }: { className?: string }) {
  const { address, chainId } = useAccount();

  const { data: charts, isLoading, isError } = useGetCharts(address, chainId);

  const isLoadingCharts = isLoading || !address || isError;
  // State to store the maximum value found in chart data
  const [maxValue, setMaxValue] = useState<number>(0);

  useEffect(() => {
    console.log("charts INIT");
  }, []);
  useEffect(() => {
    if (!charts?.length) return;

    // Convert string values to numbers and find max value in a single pass
    let localMax = 0;
    charts.forEach((chart) => {
      chart.card = Number(chart.card);
      chart.reserve = Number(chart.reserve);
      chart.dca = Number(chart.dca);

      // Calculate the sum or find the max individual value, depending on your chart type
      // If stacked chart, we need the sum of values
      const stackSum = chart.card + chart.reserve + chart.dca;
      // If not stacked, we need the largest individual value
      // const individualMax = Math.max(chart.card, chart.reserve, chart.dca);

      // Use stackSum for stacked charts, individualMax otherwise
      const currentMax = stackSum; // Change to individualMax if not using stackId in Areas

      if (currentMax > localMax) {
        localMax = currentMax;
      }
    });

    // Add 10% padding to the max value for better visualization
    setMaxValue(Math.ceil(localMax * 1.1));
  }, [charts]);

  return (
    <Card className={cn(className)}>
      {/* className={cn(
          (isLoading || !address) && "animate-pulse blur-md select-none"
        )} */}
      <CardHeader>
        <CardTitle>Savings movement</CardTitle>
        <CardDescription>Track your savings progress</CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          isLoadingCharts && "animate-pulse blur-md select-none bg-[#1e1e1e]"
        )}
      >
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={charts || loadingData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // allowDataOverflow
              hide
              domain={[1, maxValue]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillCard" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-card)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-card)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillReserve" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-reserve)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-reserve)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDca" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-dca)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-dca)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="card"
              type="natural"
              fill="url(#fillCard)"
              fillOpacity={0.4}
              stroke="var(--color-card)"
              stackId="a"
              strokeWidth={4}
            />
            <Area
              dataKey="reserve"
              type="natural"
              fill="url(#fillReserve)"
              fillOpacity={0.4}
              stroke="var(--color-reserve)"
              stackId="a"
              strokeWidth={4}
            />
            <Area
              dataKey="dca"
              type="natural"
              fill="url(#fillDca)"
              fillOpacity={0.4}
              stroke="var(--color-dca)"
              stackId="a"
              strokeWidth={4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
    </Card>
  );
}
