import axios from "axios";
import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

export type Transaction = {
  details: {
    token_in?: string;
    amount_in?: number;
    token_out?: string;
    amount_out?: number;
  };
  status: "pending" | "executed";
  timestamp: number;
  from_account?: string;
  to_account?: string;
  type: "withdraw" | "transfer" | 'spend' | 'deposit' | 'saving';
};

const fetchTransactionsList = async (
  addr: string | undefined
): Promise<Transaction[]> => {
  if (!addr) return [];
  const response = await axios
    .post(`${baseApi}/account/transactions`, { address: addr })
    .then((res) => res.data);
  return response.transactions;
};

const useGetTransactionsList = (addr: string | undefined) => {
  return useQuery({
    queryKey: ["transactions", addr],
    queryFn: () => fetchTransactionsList(addr),
    enabled: !!addr,
  });
};

export { useGetTransactionsList, fetchTransactionsList };
