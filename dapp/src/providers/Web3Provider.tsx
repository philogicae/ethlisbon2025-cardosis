"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { gnosis, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ConnectKitProvider,
  getDefaultConfig,
  type SIWEConfig,
  SIWEProvider,
} from "connectkit";
import { SiweMessage } from "siwe";
import { baseApi } from "@/constants/api";
import axios from "axios";
import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import {
  SIWE_ADDRESS,
  SIWE_CHAIN_ID,
  SIWE_SESSION_ID,
} from "@/constants/storage";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia, gnosis],
    transports: {
      // RPC URL for each chain
      [sepolia.id]: http("https://eth-sepolia.public.blastapi.io"),
      [gnosis.id]: http("https://gnosis-mainnet.public.blastapi.io"),
    },
    enableFamily: false,
    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    appName: "Cardosis",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  // Use Zustand store instead of local state
  const { sessionId, setSessionId, setIsAuthenticated } = useAppStore();
  const sessionIdFromStorage = localStorage.getItem(SIWE_SESSION_ID);
  const addressFromStorage = localStorage.getItem(SIWE_ADDRESS);
  const chainIdFromStorage = localStorage.getItem(SIWE_CHAIN_ID);

  const siweConfig: SIWEConfig = {
    getNonce: async () =>
      axios.get(`${baseApi}/siwe/nonce`).then((res) => res.data),
    createMessage: ({ nonce, address, chainId }) =>
      new SiweMessage({
        version: "1",
        domain: window.location.host,
        uri: window.location.origin,
        address,
        chainId,
        nonce,
        // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
        statement: "Sign in With Ethereum.",
      }).prepareMessage(),
    verifyMessage: async ({ message, signature }) =>
      axios
        .post(
          `${baseApi}/siwe/verify`,
          {
            message,
            signature,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const { sessionId, address, chainId } = res.data;
          if (sessionId) {
            setIsAuthenticated(true);
            setSessionId(sessionId);
            localStorage.setItem(SIWE_SESSION_ID, sessionId);
            localStorage.setItem(SIWE_ADDRESS, address);
            localStorage.setItem(SIWE_CHAIN_ID, chainId);
          }
          return res.data.ok;
        }),
    getSession: async () => {
      return axios
        .post(`${baseApi}/siwe/session`, { sessionId: sessionIdFromStorage })
        .then((res) => {
          const { sessionId, address, chainId } = res.data;
          if (sessionId) {
            setIsAuthenticated(true);
            setSessionId(sessionId);
            localStorage.setItem(SIWE_SESSION_ID, sessionId);
            localStorage.setItem(SIWE_ADDRESS, address);
            localStorage.setItem(SIWE_CHAIN_ID, chainId);
          }
          return res.data;
        })
        .catch(() => {
          setSessionId(null);
          setIsAuthenticated(false);
          localStorage.removeItem(SIWE_SESSION_ID);
          localStorage.removeItem(SIWE_ADDRESS);
          localStorage.removeItem(SIWE_CHAIN_ID);
          return null;
        });
    },
    signOut: async () => {
      return axios.post(`${baseApi}/siwe/logout`, { sessionId }).then((res) => {
        // Reset all auth-related state
        setSessionId(null);
        setIsAuthenticated(false);
        // TODO: implement functions to remove and add to localStorage
        localStorage.removeItem(SIWE_SESSION_ID);
        localStorage.removeItem(SIWE_ADDRESS);
        localStorage.removeItem(SIWE_CHAIN_ID);
        return res.data.ok;
      });
    },
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </SIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
