import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/lib/utils";

const currencies = [
  { value: "ETH", label: "ETH" },
  { value: "BNB", label: "BNB" },
  { value: "USDT", label: "USDT" },
  { value: "USDC", label: "USDC" },
  { value: "DAI", label: "DAI" },
];

const WithdrawBox = () => {
  const [currency, setCurrency] = React.useState(currencies[0].value);
  const [toMyWallet, setToMyWallet] = React.useState(true);
  return (
    <Card className="w-[520px]">
      {/* TODO: remove width */}
      <CardHeader>
        <CardTitle>Withdraw</CardTitle>
        <CardDescription>Top up your accounts</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative mb-5">
          <Select
            onValueChange={(value) => setCurrency(value)}
            value={currency}
          >
            <SelectTrigger className="text-card-foreground p-2 pl-1 pb-1 text-lg font-semibold absolute top-1/2 left-0 -translate-y-1/2 left-0 bottom-0 border-0">
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem value={currency.value} key={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className={`text-4xl w-full font-semibold text-right
                focus-visible:border-foreground transition-border-colors duration-200
            `}
            variant="ghost"
            placeholder="amount"
          />
        </div>
        <RadioGroup
          className="w-full"
          value={toMyWallet ? "toMyWallet" : "toAnother"}
          onValueChange={(value) => setToMyWallet(value === "toMyWallet")}
        >
          <Label
            htmlFor="my"
            className={cn(
              "flex items-center gap-4 p-4 border-1 rounded-lg w-full transition-colors duration-200 shadow-lg",
              toMyWallet ? "border-foreground" : ""
            )}
          >
            <RadioGroupItem value="toMyWallet" id="my" />
            <div className="flex flex-col gap-2 items-start">
              <span>To my wallet:</span>
              <span className="text-xs text-muted-foreground">
                0x230cDe8909aeBBc48CfBDf6fCc9A642439d77F83
              </span>
            </div>
          </Label>
          <Label
            className={cn(
              "flex items-center gap-4 p-4 border-1 rounded-lg w-full transition-colors duration-200",
              !toMyWallet ? "border-foreground" : ""
            )}
            htmlFor="another"
          >
            <RadioGroupItem value="toAnother" id="another" />
            <div
              className="flex flex-col gap-2 items-start w-full relative"
              style={{
                transform: "translateZ(0)",
              }}
            >
              <span>To another wallet:</span>
              <Input
                onClick={() => {
                  setToMyWallet(false);
                }}
                className="w-full pl-0 text-sm focus-visible:border-foreground transition-colors duration-200"
                placeholder="address here"
                variant="ghost"
                // disabled={toMyWallet}
              />
            </div>
          </Label>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default WithdrawBox;
