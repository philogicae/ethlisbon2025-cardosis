import axios from "axios";
import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import { SIWE_SESSION_ID } from "@/constants/storage";

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
  addr?: string,
  chainId?: number
): Promise<Transaction[]> => {
  if (!addr || !chainId) return [];
  const sessionId = localStorage.getItem(SIWE_SESSION_ID);
  const response = await axios
    .post(`${baseApi}/account/transactions`, { address: addr, sessionId, chainId })
    .then((res) => res.data);
  return response.transactions;
};

const useGetTransactionsList = (addr?: string, chainId?: number) => {
  return useQuery({
    queryKey: ["transactions", addr, chainId],
    queryFn: () => fetchTransactionsList(addr, chainId),
    enabled: !!addr && !!chainId,
    refetchOnWindowFocus: false,  // Don't refetch when window focuses
  });
};

export { useGetTransactionsList, fetchTransactionsList };
