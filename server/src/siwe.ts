import { Router } from "https://deno.land/x/oak/mod.ts";
import { parseSiweMessage, type SiweMessage } from "npm:viem/siwe";
import { publicClient } from "./rpc_client.ts";
import Database from "./db.ts";

// Singletons
const db = Database.getInstance();

interface UserSession {
	address: `0x${string}`;
	chainId: number;
	expiration: number;
}

const nonces = new Map<string, number>(); // nonce -> expirationTimestamp
const NONCE_EXPIRATION_MS = 10 * 60 * 1000;

function generateNonce(): string {
	const arr = new Uint8Array(16);
	crypto.getRandomValues(arr);
	return Array.from(arr, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const siweRouter = new Router();

// 1. Get Nonce
siweRouter.get("/nonce", (ctx) => {
	const nonce = generateNonce();
	nonces.set(nonce, Date.now() + NONCE_EXPIRATION_MS);
	for (const [storedNonce, expiry] of nonces.entries()) {
		// Basic cleanup
		if (Date.now() > expiry) nonces.delete(storedNonce);
	}
	ctx.response.status = 200;
	ctx.response.type = "text/plain";
	ctx.response.body = nonce;
});

// 2. Verify Message
siweRouter.post("/verify", async (ctx) => {
	try {
		if (!ctx.request.hasBody) {
			ctx.response.status = 400;
			ctx.response.body = { error: "Request body is required." };
			return;
		}

		const payload = await ctx.request.body.json();
		const { message, signature } = payload as {
			message: string; // EIP-4361 message string
			signature: `0x${string}`;
		};

		if (!message || !signature) {
			ctx.response.status = 400;
			ctx.response.body = { error: "Missing message or signature." };
			return;
		}

		let parsedMessage: SiweMessage;
		try {
			parsedMessage = parseSiweMessage(message) as SiweMessage;
		} catch (parseError) {
			console.error("SIWE Message Parsing Error:", parseError);
			ctx.response.status = 400;
			ctx.response.body = { error: "Invalid SIWE message format." };
			return;
		}

		if (!parsedMessage.nonce) {
			ctx.response.status = 400;
			ctx.response.body = {
				error: "Nonce missing or invalid in SIWE message.",
			};
			return;
		}

		const storedNonceExpiry = nonces.get(parsedMessage.nonce);
		if (!storedNonceExpiry || Date.now() > storedNonceExpiry) {
			if (storedNonceExpiry) nonces.delete(parsedMessage.nonce); // Clean up expired/invalid nonce
			ctx.response.status = 403;
			ctx.response.body = { error: "Nonce invalid or expired." };
			return;
		}

		let isVerified = false;
		try {
			isVerified = await publicClient.verifySiweMessage({ message, signature });
		} catch (verificationError) {
			console.error("SIWE Verification Error (viem):", verificationError);
			ctx.response.status = 401; // Unauthorized
			ctx.response.body = {
				ok: false,
				error: "Signature verification failed due to an internal error.",
			};
			return;
		}

		if (
			isVerified &&
			parsedMessage.address &&
			parsedMessage.chainId &&
			parsedMessage.nonce
		) {
			nonces.delete(parsedMessage.nonce); // Nonce is successfully used, remove it
			const sessionId = generateNonce();
			const expiration =
				nonces.get(parsedMessage.nonce) || Date.now() + NONCE_EXPIRATION_MS;
			db.addSession(
				sessionId,
				parsedMessage.address,
				parsedMessage.chainId,
				expiration,
			);
			ctx.response.status = 200;
			ctx.response.body = {
				ok: true,
				sessionId,
				address: parsedMessage.address,
				chainId: parsedMessage.chainId,
				expiration,
			};
		} else {
			if (
				isVerified &&
				(!parsedMessage.address || parsedMessage.chainId === undefined)
			) {
				console.error(
					"SIWE logic error: Verified, but address/chainId missing from parsed message.",
					parsedMessage,
				);
			}
			ctx.response.status = 401; // Unauthorized
			ctx.response.body = {
				ok: false,
				error:
					"Signature verification failed or required message fields missing.",
			};
		}
	} catch (e) {
		console.error("SIWE Verify Error:", e);
		ctx.response.status = 500;
		ctx.response.body = { error: "Server error during verification." };
	}
});

// 3. Get Session
siweRouter.post("/session", async (ctx) => {
	const { sessionId } = await ctx.request.body.json();
	const sessionData = sessionId ? db.getSession(sessionId) : null;
	if (!sessionData) {
		ctx.response.status = 401;
		ctx.response.body = { error: "Session not found." };
		return;
	}
	ctx.response.status = 200;
	ctx.response.body = sessionData;
});

// 4. Logout
siweRouter.post("/logout", async (ctx) => {
	const { sessionId } = await ctx.request.body.json();
	if (sessionId) {
		db.removeSession(sessionId);
	}
	ctx.response.status = 200;
	ctx.response.body = { ok: true };
});
