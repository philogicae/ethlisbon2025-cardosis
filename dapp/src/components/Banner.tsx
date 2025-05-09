import React from "react";
import { AnimatedBorder } from "./ui/animations/MovingBorder";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Banner = ({ className }: { className?: string }) => {
  return (
    <AnimatedBorder
      containerClassName={cn(
        "bg-[url('assets/blurry-bg.svg')] bg-cover bg-center",
        className
      )}
      duration={7000}
    >
      <Button variant="outline">Top Up</Button>
    </AnimatedBorder>
  );
};

export default Banner;
