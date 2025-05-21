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
	}),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  // Use Zustand store instead of local state
  const { sessionId, setSessionId, setIsAuthenticated, isAuthenticated } =
    useAppStore();
  console.log(isAuthenticated);
  // useEffect(() => {
  //   const id = getSessionId();
  //   if (id) {
  //     setSessionId(id);
  //   }
  // }, [getSessionId, setSessionId]);

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
          setSessionId(res.data.sessionId);
          console.log("VEIRD:", res.data);
          setIsAuthenticated(true);
          return res.data.ok;
        }),
    getSession: async () => {
      return axios
        .post(`${baseApi}/siwe/session`, { sessionId })
        .then((res) => {
          setSessionId(res.data.sessionId);
          console.log(res.data);
          setIsAuthenticated(true);
          return res.data;
        })
        .catch((error) => {
          setSessionId(null);
          setUserAddress(null);
          setIsAuthenticated(false);
          return null;
        });
    },
    signOut: async () => {
      return axios.post(`${baseApi}/siwe/logout`, { sessionId }).then((res) => {
        // Reset all auth-related state
        setSessionId(null);
        setUserAddress(null);
        setIsAuthenticated(false);
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
