"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { gnosis, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia, gnosis],
    transports: {
      // RPC URL for each chain
      [sepolia.id]: http(`https://eth-sepolia.public.blastapi.io`),
      [gnosis.id]: http(`https://gnosis-mainnet.public.blastapi.io`),
    },
    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    appName: "Cardosis",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
