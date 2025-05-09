import { baseUrl } from "@/constants/api";
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
    fetch(`${baseUrl}/networks/xdai/tokens/multi/${addr}`),
    // fetch(
    //   `${baseUrl}/networks/eth/tokens/multi/0x39b8B6385416f4cA36a20319F70D28621895279D`
    // ), // remove hardcoded contract (values should be fetched from xdai(Gnosis))
  ]);

  // Parse all responses as JSON in parallel
  const jsons = await Promise.all(responses.map(res => res.json()));

  // Combine data arrays from both responses (assuming each json has a 'data' property)
  const combinedTokens = jsons.flatMap(json => json.data);
  return combinedTokens;
};

const useToken = (searchValue: string[]) => {
  return useQuery({
    queryKey: ["token", searchValue],
    queryFn: () => fetchToken(searchValue),
    enabled: !!searchValue,
  });
};

export { useToken, fetchToken };
