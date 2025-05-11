import axios from "axios";
import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

export type ChartStamp = {
  timestamp: number;
  card: number;
  dca: number;
  reserve: number;
};

const fetchCharts = async (
  addr: string | undefined
): Promise<ChartStamp[]> => {
  if (!addr) return [];
  const response = await axios
    .post(`${baseApi}/account/charts`, { address: addr })
    .then((res) => res.data);
  return response.charts;
};

const useGetCharts = (addr: string | undefined) => {
  return useQuery({
    queryKey: ["charts", addr],
    queryFn: () => fetchCharts(addr),
    enabled: !!addr,
  });
};

export { useGetCharts, fetchCharts };
