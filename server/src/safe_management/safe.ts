import "jsr:@std/dotenv/load";
import Database from "../db.ts";
import { sepolia, gnosis } from "npm:viem/chains";
import { privateKeyToAccount } from "npm:viem/accounts";
import { publicClient } from "../rpc_client.ts";
import {
	createSafeClient,
	type SafeClient,
} from "npm:@safe-global/sdk-starter-kit";
import * as zodiacRolesSdk from "https://esm.sh/zodiac-roles-sdk@2.22.2";
import { transferRole, transferRoleKey } from "./roles/transfer.ts";
import { allowedTokenContracts } from "./roles/allowances.ts";
import { getContract, encodeFunctionData } from "npm:viem";
import { role_modifier_abi, erc20_abi } from "./abis.ts";
import { tokenList } from "./tokens.ts";

// Singletons
const db = Database.getInstance();

class SafeManager {
	private static instance: SafeManager;
	private providers: Record<number, string>;
	private signer: string;
	private auth_address: `0x${string}`;

	static getInstance(): SafeManager {
		if (!SafeManager.instance) {
			SafeManager.instance = new SafeManager();
		}
		return SafeManager.instance;
	}

	constructor() {
		this.providers = {
			[sepolia.id]: "https://eth-sepolia.public.blastapi.io",
			[gnosis.id]: "https://gnosis-mainnet.public.blastapi.io",
		};
		const signer = Deno.env.get("AUTH_PK");
		if (!signer) {
			throw new Error("Missing private key");
		}
		this.signer = signer;
		this.auth_address = privateKeyToAccount(signer as `0x${string}`)
			.address as `0x${string}`;
		console.log(`Auth wallet: ${this.auth_address}`);
	}

	private async createSafe(chainId: number): Promise<`0x${string}`> {
		// Prepare SafeClient
		const safeClient: SafeClient = await createSafeClient({
			provider: this.providers[chainId],
			signer: this.signer,
			safeOptions: {
				owners: [this.auth_address],
				threshold: 1,
				saltNonce: `0x${Math.floor(Math.random() * 1000000).toString(16)}`,
			},
		});

		// Prepare deployment transaction
		const deploymentTx =
			await safeClient.protocolKit.createSafeDeploymentTransaction();

		// Get external signer from SafeClient
		const externalSigner = await safeClient?.protocolKit
			.getSafeProvider()
			.getExternalSigner();
		if (!externalSigner) {
			throw new Error("Missing external signer");
		}

		// Send deployment transaction
		const deploymentTxHash = await externalSigner.sendTransaction({
			to: deploymentTx.to,
			value: BigInt(deploymentTx.value),
			data: deploymentTx.data as `0x${string}`,
			chain: publicClient[chainId].chain,
		});

		// Wait for deployment transaction to be confirmed
		await publicClient[chainId].waitForTransactionReceipt({
			hash: deploymentTxHash,
			confirmations: 1,
		});

		// Check if Safe is deployed
		const isDeployed = await safeClient.isDeployed();
		const safeAddress = (await safeClient.getAddress()) as `0x${string}`;
		console.log(
			`safeAddress ${isDeployed ? "deployed" : "NOT deployed"} at ${safeAddress}`,
		);
		return safeAddress;
	}

	private async addRolesToSafe(
		ownerAddress: `0x${string}`,
		chainId: number,
		safeAddress: `0x${string}`,
	) {
		// Load SafeClient
		const safeClientDeployed = await createSafeClient({
			provider: this.providers[chainId],
			signer: this.signer,
			safeAddress,
		});

		// Get allowed token contracts for chain
		const allowedTokenContractsForChain = allowedTokenContracts[chainId];
		if (!allowedTokenContractsForChain) {
			throw new Error("Missing allowed token contracts");
		}

		// Create transfer role
		const _transferRole = transferRole(
			this.auth_address,
			[ownerAddress],
			allowedTokenContractsForChain,
		);

		// Setup roles on Safe (setup + enable)
		const setupRoles = zodiacRolesSdk.setUpRolesMod({
			avatar: safeAddress,
			target: safeAddress,
			owner: safeAddress,
			roles: [_transferRole],
			enableOnTarget: true,
		});

		// Send transaction
		const moduleTx = await safeClientDeployed.send({
			transactions: setupRoles,
		});
		const moduleTxHash = moduleTx.transactions?.ethereumTxHash as `0x${string}`;
		console.log(`Tx setup roles: ${moduleTxHash}`);

		// Wait for transaction to be confirmed
		await publicClient[chainId].waitForTransactionReceipt({
			hash: moduleTxHash,
			confirmations: 1,
		});
	}

	private async transferSafeOwnership(
		ownerAddress: `0x${string}`,
		chainId: number,
		safeAddress: `0x${string}`,
	) {
		// Load SafeClient
		const safeClientDeployed = await createSafeClient({
			provider: this.providers[chainId],
			signer: this.signer,
			safeAddress,
		});

		// Send transaction to swap owner
		const changeOwner = await safeClientDeployed.createSwapOwnerTransaction({
			oldOwnerAddress: this.auth_address,
			newOwnerAddress: ownerAddress,
		});
		const changeOwnerTx = await safeClientDeployed.send({
			transactions: [changeOwner],
		});
		const changeOwnerTxHash = changeOwnerTx.transactions
			?.ethereumTxHash as `0x${string}`;
		console.log(`Tx change owner: ${changeOwnerTxHash}`);

		// Wait for transaction to be confirmed
		await publicClient[chainId].waitForTransactionReceipt({
			hash: changeOwnerTxHash,
			confirmations: 1,
		});
	}

	private async createSubAccount(
		ownerAddress: `0x${string}`,
		chainId: number,
	): Promise<`0x${string}`> {
		const safeAddress = await this.createSafe(chainId);
		await this.addRolesToSafe(ownerAddress, chainId, safeAddress);
		await this.transferSafeOwnership(ownerAddress, chainId, safeAddress);
		return safeAddress;
	}

	async createAccount(
		ownerAddress: `0x${string}`,
		chainId: number,
	): Promise<{
		card: `0x${string}`;
		dca: `0x${string}`;
		reserve: `0x${string}`;
	}> {
		console.log(`Creating account for ${ownerAddress} on chain ${chainId}`);
		console.log("Creating card safe...");
		const cardSafeAddress = await this.createSubAccount(ownerAddress, chainId);
		console.log("Creating dca safe...");
		const dcaSafeAddress = await this.createSubAccount(ownerAddress, chainId);
		console.log("Creating reserve safe...");
		const reserveSafeAddress = await this.createSubAccount(
			ownerAddress,
			chainId,
		);
		return {
			card: cardSafeAddress,
			dca: dcaSafeAddress,
			reserve: reserveSafeAddress,
		};
	}

	private async getRoleModifierContract(
		ownerAddress: `0x${string}`,
		chainId: number,
		safe: string,
	) {
		// Check addresses
		if (!["card", "dca", "reserve"].includes(safe)) {
			throw new Error("Invalid 'safe' address");
		}
		// deno-lint-ignore no-explicit-any
		const account: any = db.getAccount(ownerAddress, chainId) || {};
		if (!account) {
			throw new Error("Account not found");
		}
		const safeAddress = account[safe];
		if (!safeAddress) {
			throw new Error("Safe not found");
		}

		// Load SafeClient
		const safeClientDeployed = await createSafeClient({
			provider: this.providers[chainId],
			signer: this.signer,
			safeAddress,
		});

		// Get external signer from SafeClient
		const externalSignerDeployed = await safeClientDeployed.protocolKit
			.getSafeProvider()
			.getExternalSigner();
		if (!externalSignerDeployed) {
			throw new Error("Missing external signer");
		}

		// Get role modifier contract for this safe
		const role_modifier_addr = (
			await safeClientDeployed.protocolKit.getModules()
		)[0];
		const role_modifier = getContract({
			address: role_modifier_addr,
			abi: role_modifier_abi,
			client: externalSignerDeployed,
		});
		return role_modifier;
	}

	async transferTokens(
		ownerAddress: `0x${string}`,
		chainId: number,
		from: string,
		to: string,
		token: string,
		amount: bigint,
	) {
		// Check addresses
		if (!["card", "dca", "reserve"].includes(from)) {
			throw new Error("Invalid 'from' address");
		}
		// deno-lint-ignore no-explicit-any
		const account: any = db.getAccount(ownerAddress, chainId) || {};
		if (!account) {
			throw new Error("Account not found");
		}
		account.gnosispay = this.auth_address;
		const toAddress = (account[to] || to) as `0x${string}`;
		console.log(
			`Transferring ${amount} ${token} from ${from} (${account[from]}) to ${to} (${toAddress})`,
		);

		// Get role modifier contract
		const role_modifier = await this.getRoleModifierContract(
			ownerAddress,
			chainId,
			from,
		);

		// Encode transfer calldata
		const transfer_calldata = encodeFunctionData({
			abi: erc20_abi,
			functionName: "transfer",
			args: [toAddress, amount],
		});

		// Execute transfer
		const tokenAddress = tokenList[chainId][token];
		const tx_hash = await role_modifier.write.execTransactionWithRole([
			tokenAddress,
			0n, // value
			transfer_calldata,
			0, // operation: 0 = call
			transferRoleKey,
			true, // shouldRevert
		]);
		console.log(`Tx transfer: ${tx_hash}`);

		// Wait for transaction to be confirmed
		await publicClient[chainId].waitForTransactionReceipt({
			hash: tx_hash,
			confirmations: 1,
		});
	}
}

export default SafeManager;
