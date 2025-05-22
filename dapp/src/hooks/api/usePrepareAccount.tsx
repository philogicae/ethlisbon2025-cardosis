import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

// export type Token = {
//   attributes: {
//     name: string;
//     symbol: string;
//     coingecko_coin_id: string;
//     price_usd: string;
//     fdv_usd: string;
//     market_cap_usd: string;
//     total_reserve_in_usd: string;
//     image_url: string;
//   };
//   id: number;
// };

const checkAccount = async (
  addr?: string,
  sessionId?: string,
  chainId?: number
): Promise<{
  status: string;
  safes: { card: string; dca: string; reserve: string };
}> => {
  const response = await apiClient
    .post(`${baseApi}/account`, { address: addr, sessionId, chainId })
    .then((res) => res.data);

  return response;
};

const createAccount = async (
  addr?: string,
  sessionId?: string,
  chainId?: number
): Promise<{ status: string }> => {
  const response = await apiClient
    .post(`${baseApi}/account/create`, { address: addr, sessionId, chainId })
    .then((res) => res.data);

  return response.data.status;
};

const usePrepareAccount = (
  addr?: string,
  sessionId?: string,
  chainId?: number
) => {
  return useQuery({
    queryKey: ["prepare-account", addr],
    queryFn: () => checkAccount(addr, sessionId, chainId),
    enabled: !!addr,
  });
};

export { usePrepareAccount, checkAccount, createAccount };
