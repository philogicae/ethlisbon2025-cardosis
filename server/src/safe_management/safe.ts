import "jsr:@std/dotenv/load";
import { sepolia, gnosis } from "npm:viem/chains";
import { privateKeyToAccount } from "npm:viem/accounts";
import {
	createPublicClient,
	http,
	getContract,
	encodeFunctionData,
} from "npm:viem";
import { createSafeClient } from "npm:@safe-global/sdk-starter-kit";
import * as zodiacRolesSdk from "https://esm.sh/zodiac-roles-sdk@2.22.2";
import { transferRole } from "./roles/transfer.ts";
import { role_modifier_abi, erc20_abi } from "./roles/abis.ts";

class SafeManager {
	private static instance: SafeManager;
	private provider: string;
	private signer: string;
	private wallet_address: `0x${string}`;

	static getInstance(): SafeManager {
		if (!SafeManager.instance) {
			SafeManager.instance = new SafeManager();
		}
		return SafeManager.instance;
	}

	constructor() {
		this.provider = sepolia.rpcUrls.default.http[0];
		const signer = Deno.env.get("AUTH_PK");
		if (!signer) {
			throw new Error("Missing private key");
		}
		this.signer = signer;
		this.wallet_address = privateKeyToAccount(signer as `0x${string}`)
			.address as `0x${string}`;
		console.log(`Auth wallet: ${this.wallet_address}`);
	}
}

export default SafeManager;
