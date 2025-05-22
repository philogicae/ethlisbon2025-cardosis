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
import { useGetTransactionsList } from "@/hooks/api/useGetTransactionslist";
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
import { useAppStore } from "@/stores/useAppStore";

const mockTransactions = [
  {
    account: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: 22.5,
    currency: "EURe",
    timestamp: 1746887385749,
    type: "withdraw",
    details: {
      token_out: "EURe",
      amount_out: 22.5,
    },
    status: "executed",
  },
  {
    account: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: 22.5,
    currency: "EURe",
    timestamp: 1746887385749,
    from_account: "reserve",
    to_account: "card",
    type: "transfer",
    details: {
      token_out: "EURe",
      amount_out: 22.5,
    },
    status: "executed",
  },
  {
    account: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: 22.5,
    currency: "EURe",
    timestamp: 1746887385749,
    type: "withdraw",
    details: {
      token_out: "EURe",
      amount_out: 22.5,
    },
    status: "executed",
  },
  {
    account: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: 322.5,
    currency: "EURe",
    timestamp: 1746887385749,
    from_account: "reserve",
    to_account: "card",
    type: "transfer",
    details: {
      token_in: "EURe",
      amount_in: 322.5,
    },
    status: "executed",
  },
  {
    account: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: 1122.5,
    currency: "EURe",
    timestamp: 1746887385749,
    type: "withdraw",
    details: {
      token_out: "EURe",
      amount_out: 1122.5,
    },
    status: "executed",
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

export function RecentTransactions({
  className,
  isMobile,
}: {
  className?: string;
  isMobile: boolean;
}) {
  const { isAuthenticated } = useAppStore();
  const {
    isLoading: isLoadingTransactions,
    data: transactions,
    isError,
  } = useGetTransactionsList();
  const isLoading = isLoadingTransactions || isError || !isAuthenticated;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          You&apos;ve made{" "}
          {isLoading ? (
            <span className="blur-md animate-pulse select-none">10</span>
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
              <li
                key={i}
                className={cn(
                  transaction.type === "scheduled" &&
                    "animate-pulse px-1.5 p-2 -m-2 border-dashed border rounded-lg",
                  "flex items-center justify-between"
                )}
              >
                <div className="flex gap-4 items-center">
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
                      className="text-sm text-muted-foreground"
                    >
                      {humanReadableDate(transaction.timestamp)}
                    </time>
                  </div>
                </div>

                {!isMobile && (
                  <div
                    className={cn(
                      isLoading && "animate-pulse blur-md select-none",
                      "flex items-center gap-2 ml-auto text[#e1e1e1]- mr-4"
                    )}
                  >
                    {transaction.from_account}
                    <MoveRight size={16} />
                    {transaction.to_account}
                  </div>
                )}
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
                    {Math.abs(
                      transaction.details.amount_in ||
                        transaction.details.amount_out ||
                        0
                    )}
                  </span>

                  <div
                    className={cn(
                      isLoading && "animate-pulse blur-md select-none",
                      "flex items-center gap-2 text-sm text-muted-foreground"
                    )}
                  >
                    <p>
                      {transaction.details.token_in ||
                        transaction.details.token_out ||
                        "EURe"}
                    </p>
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
