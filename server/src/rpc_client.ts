import { createPublicClient, http } from "npm:viem";
import { sepolia } from "npm:viem/chains";

export const publicClient = createPublicClient({
	chain: sepolia,
	transport: http(),
});
