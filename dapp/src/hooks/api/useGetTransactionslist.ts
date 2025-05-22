import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { useAppStore } from "@/stores/useAppStore";

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

const fetchTransactionsList = async (): Promise<Transaction[]> => {
  const response = await apiClient
    .post(`${baseApi}/account/transactions`)
    .then((res) => res.data);
  return response.transactions;
};

const useGetTransactionsList = () => {
  const { sessionId } = useAppStore();
  return useQuery({
    queryKey: ["transactions", sessionId],
    queryFn: () => fetchTransactionsList(),
    enabled: !!sessionId,
    refetchOnWindowFocus: false,  // Don't refetch when window focuses
  });
};

export { useGetTransactionsList, fetchTransactionsList };
