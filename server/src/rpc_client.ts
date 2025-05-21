import { createPublicClient, http, type PublicClient } from "npm:viem";
import { sepolia, gnosis } from "npm:viem/chains";

export const publicClient: Record<number, PublicClient> = {
	[sepolia.id]: createPublicClient({
		chain: sepolia,
		transport: http("https://eth-sepolia.public.blastapi.io"),
	}),
	[gnosis.id]: createPublicClient({
		chain: gnosis,
		transport: http("https://gnosis-mainnet.public.blastapi.io"),
	}),
};
