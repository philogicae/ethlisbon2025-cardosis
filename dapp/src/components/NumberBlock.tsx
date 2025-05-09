import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { TrendingUpIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const NumberBlock = ({
  description,
  value,
  className,
}: {
  description: string;
  value: number;
  className?: string;
}) => {
  return (
    <Card className={cn(className)}>
      <CardHeader className="relative">
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-3xl font-black">€{value}</CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <TrendingUpIcon className="size-3" />
            +12.5%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month <TrendingUpIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">
          Visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default NumberBlock;
