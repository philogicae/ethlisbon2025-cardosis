import { geckoApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

export type Token = {
  attributes: {
    name: string;
    symbol: string;
    coingecko_coin_id: string;
    price_usd: string;
    fdv_usd: string;
    market_cap_usd: string;
    total_reserve_in_usd: string;
    image_url: string;
  };
  id: number;
};

const fetchToken = async (addr: string[]): Promise<Token[]> => {
  const response = await apiClient
    .get(`${geckoApi}/networks/xdai/tokens/multi/${addr}`)
    .then((res) => res.data);
    
  return response.data;
};

const useGetTokens = (searchValue: string[]) => {
  return useQuery({
    queryKey: ["token", searchValue],
    queryFn: () => fetchToken(searchValue),
    enabled: !!searchValue,
  });
};

export { useGetTokens, fetchToken };
