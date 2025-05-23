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

const checkAccount = async (): Promise<{
  status: string;
  safes: { card: string; dca: string; reserve: string };
}> => {
  const response = await apiClient
    .post(`${baseApi}/account`)
    .then((res) => res.data);

  return response;
};

const createAccount = async (): Promise<{ status: string }> => {
  const response = await apiClient
    .post(`${baseApi}/account/create`)
    .then((res) => res.data);

  return response.data.status;
};

const usePrepareAccount = () => {
  return useQuery({
    queryKey: ["prepare-account"],
    queryFn: () => checkAccount(),
    enabled: true,
  });
};

export { usePrepareAccount, checkAccount, createAccount };
