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

const currencies = [
  { value: "ETH", label: "ETH" },
  { value: "BNB", label: "BNB" },
  { value: "USDT", label: "USDT" },
  { value: "USDC", label: "USDC" },
  { value: "DAI", label: "DAI" },
];

const WithdrawBox = () => {
  const [currency, setCurrency] = React.useState(currencies[0].value);
  return (
    <Card className="w-[520px]">
      {" "}
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
                focus-visible:border-accent transition-border-colors duration-200
            `}
            variant="ghost"
            placeholder="amount"
          />
        </div>
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1">Default</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="r2" />
            <Label htmlFor="r2">Comfortable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="r3" />
            <Label htmlFor="r3">Compact</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default WithdrawBox;
