import React from "react";
import { useToken } from "@/hooks/api/useTokens";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { tokens } from "@/constants/tokens";
import autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CarouselTokens = ({ className }: { className?: string }) => {
  const { data, isLoading } = useToken(tokens.map((t) => t.address));
  console.log(data);
  return (
    <Carousel
      className={cn(className, "h-full")}
      opts={{ loop: true }}
      plugins={[autoplay()]}
    >
      <CarouselContent className="h-full">
        {data?.map((token, index) => (
          <CarouselItem key={index} className="h-full">
            <Card className="h-full justify-center">
              <CardHeader className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={token.attributes.image_url}
                      alt={token.attributes.name}
                    />
                    <AvatarFallback>
                      {token.attributes.symbol[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardDescription>{token.attributes.symbol}</CardDescription>
                </CardTitle>
                <span className="text-4xl font-semibold">
                  ${formatNumber(token.attributes.price_usd)}
                </span>
              </CardHeader>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
    <CarouselNext /> */}
    </Carousel>
  );
};

export default CarouselTokens;
