import axios from "axios";
import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

export type Balance = {
  card: number | null;
  dca_current: number | null;
  dca_total: number | null;
  reserve: number | null;
};

const fetchBalances = async (addr?: string, sessionId?: string, chainId?: number): Promise<Balance> => {
  if (!addr || !sessionId || !chainId) return {card: null, dca_current: null, dca_total: null, reserve: null};
  const response = await axios
    .post(`${baseApi}/account/balances`, { address: addr, sessionId, chainId })
    .then((res) => res.data);

  return response.balances;
};

const useGetBalances = (searchValue?: string, sessionId?: string , chainId?: number) => {
  return useQuery({
    queryKey: ["balances", searchValue],
    queryFn: () => fetchBalances(searchValue, sessionId, chainId),
    enabled: !!searchValue && !!sessionId && !!chainId,
  });
};

export { useGetBalances, fetchBalances };
