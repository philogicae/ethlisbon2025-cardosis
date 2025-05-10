import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { cn, humanReadableDate } from "@/lib/utils";
import { useTransactionsList } from "@/hooks/api/useTransactionslist";
import { useAccount } from "wagmi";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Send,
  CreditCard,
  Euro,
  MoveRight,
  PiggyBank,
} from "lucide-react";

const mockTransactions = [
  {
    account: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: 22.5,
    currency: "EURe",
    timestamp: 1746887385749,
    type: "withdraw",
  },
  {
    account: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: 22.5,
    currency: "EURe",
    timestamp: 1746887385749,
    from_account: "reserve",
    to_account: "card",
    type: "transfer",
  },
  {
    account: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: 22.5,
    currency: "EURe",
    timestamp: 1746887385749,
    type: "withdraw",
  },
  {
    account: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: 322.5,
    currency: "EURe",
    timestamp: 1746887385749,
    from_account: "reserve",
    to_account: "card",
    type: "transfer",
  },
  {
    account: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: 1122.5,
    currency: "EURe",
    timestamp: 1746887385749,
    type: "withdraw",
  },
];

const avtrsmth = (type: string) => {
  switch (type) {
    case "withdraw":
      return <BanknoteArrowDown size={28} />;
    case "deposit":
      return <BanknoteArrowUp size={28} />;
    case "transfer":
      return <Send size={28} />;
    case "spend":
      return <CreditCard size={28} />;
    case "saving":
      return <PiggyBank size={28} />;
    default:
      return <Euro size={28} />;
  }
};

export function RecentTransactions({ className }: { className?: string }) {
  const { address } = useAccount();
  const { isLoading, data: transactions } = useTransactionsList(address);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          You&apos;ve made{" "}
          {isLoading ? (
            <span className="animate-pulse blur-md select-none">10</span>
          ) : (
            transactions?.length
          )}{" "}
          transactions today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-6">
          {(isLoading ? mockTransactions : transactions)
            ?.slice(0, 5)
            .map((transaction, i) => (
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      isLoading && "animate-pulse blur-md select-none",
                      "h-10 w-10 rounded-full bg-accent text-secondary flex items-center justify-center"
                    )}
                  >
                    {avtrsmth(transaction.type)}
                  </div>
                  <div
                    className={cn(
                      isLoading && "animate-pulse blur-md select-none"
                    )}
                  >
                    <p className="font-medium text-white capitalize">
                      {transaction.type}
                    </p>
                    <time
                      dateTime={transaction.timestamp.toString()}
                      className="text-muted-foreground text-sm"
                    >
                      {humanReadableDate(transaction.timestamp)}
                    </time>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={cn(
                      isLoading && "animate-pulse blur-md select-none",
                      transaction.type === "withdraw"
                        ? "text-destructive"
                        : "text-foreground",
                      "font-medium text-lg"
                    )}
                  >
                    {transaction.type === "withdraw" ? "-" : "+"}€
                    {Math.abs(transaction.amount)}
                  </span>

                  <div
                    className={cn(
                      isLoading && "animate-pulse blur-md select-none",
                      "flex items-center gap-2 text-sm text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 ml-auto text-card-foreground">
                      ({transaction.from_account}
                      <MoveRight size={16} />
                      {transaction.to_account})
                    </div>
                    <p>{transaction.currency}</p>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="mx-auto">
          See all
        </Button>
      </CardFooter>
    </Card>
  );
}
