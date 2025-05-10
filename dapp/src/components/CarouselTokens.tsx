import React from "react";
import { useToken } from "@/hooks/api/useTokens";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { tokens } from "@/constants/tokens";
import autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const loaderToken = {
  attributes: {
    image_url: "",
    name: "Gnosis Token on xDai",
    symbol: "GNO",
    price_usd: 123,
  },
};

const CarouselTokens = ({ className }: { className?: string }) => {
  const { data, isLoading } = useToken(tokens.map((t) => t.address));

  return (
    <Carousel
      className={cn(className, "h-full")}
      opts={{ align: "start", loop: true }}
      plugins={[autoplay()]}
      orientation="vertical"
    >
      <CarouselContent className="h-[196px]">
        {(isLoading ? [loaderToken, loaderToken] : data)?.map(
          (token, index) => (
            <CarouselItem key={index} className="basis-1/2">
              <Card className="justify-center py-5">
                <CardHeader className="flex items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Avatar
                      className={cn(
                        "h-6 w-6",
                        isLoading && "animate-pulse blur-md select-none"
                      )}
                    >
                      <AvatarImage
                        src={token.attributes.image_url}
                        alt={token.attributes.name}
                      />
                      <AvatarFallback>
                        {token.attributes.symbol[0]}
                      </AvatarFallback>
                    </Avatar>
                    <CardDescription
                      className={cn(
                        isLoading && "animate-pulse blur-md select-none"
                      )}
                    >
                      {token.attributes.symbol}
                    </CardDescription>
                  </CardTitle>
                  <span
                    className={cn(
                      "text-4xl font-semibold",
                      isLoading && "animate-pulse blur-md select-none"
                    )}
                  >
                    ${formatNumber(token.attributes.price_usd)}
                  </span>
                </CardHeader>
              </Card>
            </CarouselItem>
          )
        )}
      </CarouselContent>
    </Carousel>
  );
};

export default CarouselTokens;
