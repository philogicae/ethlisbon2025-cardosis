import { sepolia, gnosis } from "npm:viem/chains";

export const allowedTokenContracts: Record<string, `0x${string}`[]> = {
	[sepolia.id]: [
		"0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", // USDC
	],
	[gnosis.id]: [
		"0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1", // WETH
		"0x420CA0f9B9b604cE0fd9C18EF134C705e5Fa3430", // EURe
		"0x177127622c4A00F3d409B75571e12cB3c8973d3c", // COW
	],
};
