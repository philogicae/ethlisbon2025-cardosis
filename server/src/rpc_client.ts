import { createPublicClient, http, type PublicClient } from "npm:viem";
import { sepolia, gnosis } from "npm:viem/chains";

export const publicClient: Record<number, PublicClient> = {
	[sepolia.id]: createPublicClient({
		chain: sepolia,
		transport: http(),
	}),
	[gnosis.id]: createPublicClient({
		chain: gnosis,
		transport: http(),
	}),
};
