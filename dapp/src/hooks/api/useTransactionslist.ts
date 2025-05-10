import axios from "axios";
import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

export type Token = {
  account: string;
  amount: number;
  currency: string;
  timestamp: number;
  from_account?: string;
  to_account?: string;
  type: "withdraw" | "transfer" | 'spend' | 'deposit';
};

const fetchTransactionsList = async (
  addr: string | undefined
): Promise<Token[]> => {
  if (!addr) return [];
  const response = await axios
    .post(`${baseApi}/account/transactions`, { address: addr })
    .then((res) => res.data);
  return response.transactions;
};

const useTransactionsList = (addr: string | undefined) => {
  return useQuery({
    queryKey: ["transactions", addr],
    queryFn: () => fetchTransactionsList(addr),
    enabled: !!addr,
  });
};

export { useTransactionsList, fetchTransactionsList };
