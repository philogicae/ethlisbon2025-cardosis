import axios from "axios";
import { baseApi } from "@/constants/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SIWE_SESSION_ID } from "@/constants/storage";

const mockPay = async (
  addr?: string,
  chainId?: number
): Promise<{ status?: string }> => {
  if (!addr || !chainId) return {};
  const sessionId = localStorage.getItem(SIWE_SESSION_ID);
  const response = await axios
    .post(`${baseApi}/mock/spend`, {
      address: addr,
      sessionId,
      chainId,
      amount: 1,
    })
    .then((res) => res.data);

  return response;
};

const useMockPay = (addr?: string, chainId?: number) => {
  return useQuery({
    queryKey: ["Pay", addr, chainId],
    queryFn: () => mockPay(addr, chainId),
    enabled: false,
  });
};

export const useMockPayMutation = () => {
    return useMutation({
      mutationFn: ({ address, chainId }: { address?: string; chainId?: number }) => 
        mockPay(address, chainId),
      onSuccess: (data) => {
        // You can perform actions on success, like showing a notification
        return data
      },
    });
  };

export { useMockPay, mockPay };
