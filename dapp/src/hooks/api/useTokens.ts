import axios from "axios";
import { geckoApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

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
  const responses = await Promise.all([
    axios
      .get(`${geckoApi}/networks/xdai/tokens/multi/${addr}`)
      .then((res) => res.data),
    // fetch(
    //   `${baseUrl}/networks/eth/tokens/multi/0x39b8B6385416f4cA36a20319F70D28621895279D`
    // ), // remove hardcoded contract (values should be fetched from xdai(Gnosis))
  ]);

  const tokens = await Promise.all(
    responses.map(async (response) => {
      // const res = await response.json();
      const res = response.data;
      //   remove this type later
      return res.data.map(
        (item: {
          attributes: { address: string; name: string; symbol: string };
        }) => {
          return {
            address: item.attributes.address,
            name: item.attributes.name,
            symbol: item.attributes.symbol,
          };
        }
      );
    })
  );
  return tokens.flat();
};

const useToken = (searchValue: string[]) => {
  return useQuery({
    queryKey: ["token", searchValue],
    queryFn: () => fetchToken(searchValue),
    enabled: !!searchValue,
  });
};

export { useToken, fetchToken };
