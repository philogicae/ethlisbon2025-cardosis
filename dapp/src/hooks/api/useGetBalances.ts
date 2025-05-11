import axios from "axios";
import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import { SIWE_SESSION_ID } from "@/constants/storage";

export type Balance = {
  card: number | null;
  dca_current: number | null;
  dca_total: number | null;
  reserve: number | null;
};

const fetchBalances = async (addr: string | undefined): Promise<Balance> => {
  const sessionId = localStorage.getItem(SIWE_SESSION_ID) || "";
  const response = await axios
    .post(`${baseApi}/account/balances`, { address: addr, sessionId })
    .then((res) => res.data);

  return response.balances;
};

const useGetBalances = (searchValue: string | undefined) => {
  return useQuery({
    queryKey: ["balances", searchValue],
    queryFn: () => fetchBalances(searchValue),
    enabled: !!searchValue,
  });
};

export { useGetBalances, fetchBalances };
