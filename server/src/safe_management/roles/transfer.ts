import type * as zodiacRolesSdk from "https://esm.sh/zodiac-roles-sdk@2.22.2";
import { stringToBytes, bytesToHex, pad } from "npm:viem";
// import { allow } from "npm:defi-kit/gno";

const formatBytes32String = (str: string) => {
	return bytesToHex(
		pad(stringToBytes(str), {
			size: 32,
			dir: "right",
		}),
	);
};

export const transferRoleKey = formatBytes32String("transfer");

export const transferRole = (
	auth_wallet: `0x${string}`,
	allowedTransferAddresses: `0x${string}`[],
	allowedTokenContracts: `0x${string}`[],
): {
	key: string;
	members: `0x${string}`[];
	permissions: (zodiacRolesSdk.Permission | zodiacRolesSdk.PermissionSet)[];
} => {
	const nativeTransferPermissions = allowedTransferAddresses.map((address) => {
		return { targetAddress: address, send: true } as zodiacRolesSdk.Permission;
	});
	const tokenTransferPermissions = allowedTokenContracts.map(
		(targetAddress) => {
			return {
				targetAddress,
				signature: "transfer(address,uint256)",
			};
		},
	);

	return {
		key: transferRoleKey,
		members: [auth_wallet],
		permissions: [...nativeTransferPermissions, ...tokenTransferPermissions],
	};
};
