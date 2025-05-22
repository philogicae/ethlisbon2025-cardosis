import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

export type ChartStamp = {
  timestamp: number;
  card: number;
  dca: number;
  reserve: number;
};

const fetchCharts = async (): Promise<ChartStamp[]> => {
  const response = await apiClient
    .post(`${baseApi}/account/charts`)
    .then((res) => res.data);
  return response.charts; 
};

const useGetCharts = () => {
  return useQuery({
    queryKey: ["charts"],
    queryFn: () => fetchCharts(),
    refetchOnWindowFocus: false,  // Don't refetch when window focuses
  });
};

export { useGetCharts, fetchCharts };
