import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { useAppStore } from "@/stores/useAppStore";

export type Balance = {
  card: number | null;
  dca_current: number | null;
  dca_total: number | null;
  reserve: number | null;
};

const fetchBalances = async (): Promise<Balance> => {
  const response = await apiClient
    .post(`${baseApi}/account/balances`)
    .then((res) => res.data);

  return response.balances;
};

const useGetBalances = () => {
  const { sessionId } = useAppStore();
  return useQuery({
    queryKey: ["balances", sessionId],
    queryFn: () => fetchBalances(),
    enabled: !!sessionId,
    refetchOnWindowFocus: false,
  });
};

export { useGetBalances, fetchBalances };
