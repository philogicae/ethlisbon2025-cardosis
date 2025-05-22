import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

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
  return useQuery({
    queryKey: ["balances"],
    queryFn: () => fetchBalances(),
    refetchOnWindowFocus: false,
  });
};

export { useGetBalances, fetchBalances };
