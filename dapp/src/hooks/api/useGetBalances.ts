import axios from "axios";
import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

export type Balance = {
    card: number | null,
    dca_current: number | null,
    dca_total: number | null,
    reserve: number | null,
};

const fetchBalances = async (addr: string | undefined): Promise<Balance> => {
  const response = await axios
    .post(`${baseApi}/account/balances`, { address: addr })
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
