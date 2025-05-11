import { sepolia, gnosis } from "npm:viem/chains";
import { tokenList } from "../tokens.ts";

export const allowedTokenContracts: Record<number, `0x${string}`[]> = {
	[sepolia.id]: Object.values(tokenList[sepolia.id]) as `0x${string}`[],
	[gnosis.id]: Object.values(tokenList[gnosis.id]) as `0x${string}`[],
};
