import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import { SIWE_SESSION_ID } from "@/constants/storage";
import apiClient from "@/lib/api";

export type ChartStamp = {
  timestamp: number;
  card: number;
  dca: number;
  reserve: number;
};

const fetchCharts = async (addr: string | undefined, chainId?: number): Promise<ChartStamp[]> => {
  if (!addr || !chainId) return [];
  const sessionId = localStorage.getItem(SIWE_SESSION_ID);
  const response = await apiClient
    .post(`${baseApi}/account/charts`, { address: addr, sessionId, chainId })
    .then((res) => res.data);
  return response.charts; 
};

const useGetCharts = (addr: string | undefined, chainId?: number) => {
  return useQuery({
    queryKey: ["charts", addr, chainId],
    queryFn: () => fetchCharts(addr, chainId),
    enabled: !!addr && !!chainId,
    refetchOnWindowFocus: false,  // Don't refetch when window focuses
  });
};

export { useGetCharts, fetchCharts };
