import axios from "axios";
import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import { SIWE_SESSION_ID } from "@/constants/storage";

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

const checkAccount = async (addr: string): Promise<unknown> => {
  const sessionId = localStorage.getItem(SIWE_SESSION_ID) || "";
  const response = await axios
    .post(`${baseApi}/account`, { address: addr, sessionId })
    .then((res) => res.data);

  return response.data.status;
};

const createAccount = async (addr: string): Promise<unknown> => {
  const sessionId = localStorage.getItem(SIWE_SESSION_ID) || "";
  const response = await axios
    .post(`${baseApi}/account/create`, { address: addr, sessionId })
    .then((res) => res.data);

  return response.data.status;
};

// const fetchStatus = async (addr: string): Promise<any> => {
//   const response = await axios
//     .post(`${baseApi}/account/create/status`, { address: addr })
//     .then((res) => res.data);

//   return response.data;
// };

const usePrepareAccount = (addr: string | undefined) => {
  return useQuery({
    queryKey: ["prepare-account", addr],
    queryFn: () => checkAccount(addr!),
    enabled: !!addr,
  });
};

export { usePrepareAccount, checkAccount, createAccount };
