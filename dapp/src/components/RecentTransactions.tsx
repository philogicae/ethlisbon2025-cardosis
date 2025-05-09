import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const transactions = [
  {
    name: "USDT",
    date: "2025-08-08",
    amount: 1999.0,
    avatar: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  {
    name: "ETH",
    date: "2025-07-08",
    amount: 39.0,
    avatar: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  {
    name: "SHIBA",
    date: "2025-06-08",
    amount: -299.0,
    avatar: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  },
  {
    name: "MATIC",
    date: "2025-06-08",
    amount: 99.0,
    avatar: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  },
  {
    name: "USDT",
    date: "2025-05-08",
    amount: -39.0,
    avatar: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
];

export function RecentTransactions({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          You&apos;ve made 10 transactions today.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {transactions.map((transaction, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${transaction.avatar}/logo.png`}
                  alt={transaction.name}
                />
                <AvatarFallback>{transaction.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">{transaction.name}</p>
                <p className="text-muted-foreground text-sm">
                  {transaction.date}
                </p>
              </div>
            </div>
            <div
              className={`font-medium text-lg ${
                transaction.amount > 0 ? "text-foreground" : "text-destructive"
              }`}
            >
              {transaction.amount > 0 ? "+" : "-"}$
              {Math.abs(transaction.amount)}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline">See all</Button>
      </CardFooter>
    </Card>
  );
}
