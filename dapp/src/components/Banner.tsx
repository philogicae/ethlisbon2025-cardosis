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
      <div className="p-4 flex flex-wrap gap-4">
        <p className="text-2xl font-bold w-full text-center uppercase">
          Fuel Your Safe - Instantly
        </p>
        <Button variant="outline" className="m-auto">
          Top Up
        </Button>
      </div>
    </AnimatedBorder>
  );
};

export default Banner;
