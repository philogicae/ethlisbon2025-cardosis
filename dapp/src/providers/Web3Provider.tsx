"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { gnosis, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ConnectKitProvider,
  getDefaultConfig,
  SIWEConfig,
  SIWEProvider,
} from "connectkit";
import { SiweMessage } from "siwe";
import { baseApi } from "@/constants/api";
import axios from "axios";
import { SIWE_SESSION_ID } from "@/constants/storage";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia, gnosis],
    transports: {
      // RPC URL for each chain
      [sepolia.id]: http(`https://eth-sepolia.public.blastapi.io`),
      [gnosis.id]: http(`https://gnosis-mainnet.public.blastapi.io`),
    },
    enableFamily: false,
    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    appName: "Cardosis",
  })
);

const queryClient = new QueryClient();

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
        localStorage.setItem(SIWE_SESSION_ID, res.data.sessionId);
        return res.data.ok;
      }),
  getSession: async () => {
    const sessionId = localStorage.getItem(SIWE_SESSION_ID) || "";

    return axios.post(`${baseApi}/siwe/session`, { sessionId }).then((res) => {
      if (res.data.address) {
        return res.data;
      } else {
        localStorage.removeItem(SIWE_SESSION_ID);
        return null;
      }
    });
  },
  signOut: async () => {
    const sessionId = localStorage.getItem(SIWE_SESSION_ID) || "";
    return axios.post(`${baseApi}/siwe/signout`, { sessionId }).then((res) => {
      localStorage.removeItem(SIWE_SESSION_ID);
      return res.data.ok;
    });
  },
};

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
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
