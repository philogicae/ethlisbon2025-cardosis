import { baseApi } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

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
