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
import { Switch } from "./ui/switch";

const WithdrawBox = () => {
  return (
    <Card className="w-[520px]">
      {" "}
      {/* TODO: remove width */}
      <CardHeader>
        <CardTitle>Withdraw</CardTitle>
        <CardDescription>Withdraw your funds</CardDescription>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter amount" />
        <Label
          className="flex flex-col items-start gap-[0.5rem] cursor-pointer select-none"
          htmlFor="toMe"
        >
          <span className="font-semibold text-white">To another address</span>
          {/* <div className="text-muted-foreground text-sm font-light leading-[1.2rem]">
              Automatically round up every expense to the nearest whole number.
            </div> */}
        </Label>
        <Switch id="toMe" defaultChecked />
      </CardContent>
    </Card>
  );
};

export default WithdrawBox;
