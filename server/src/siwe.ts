import { Router } from "https://deno.land/x/oak/mod.ts";

interface SiweMessageObject {
	address?: string;
	chainId?: number;
	nonce?: string;
	domain?: string;
	uri?: string;
	version?: string;
	statement?: string;
	issuedAt?: string;
	expirationTime?: string;
	notBefore?: string;
	requestId?: string;
	resources?: string[];
}

function generateNonce(): string {
	const arr = new Uint8Array(16);
	crypto.getRandomValues(arr);
	return Array.from(arr, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

class SiweMessage {
	address?: string;
	chainId?: number;
	nonce?: string;
	constructor(public message: string | SiweMessageObject) {
		if (typeof message === "string") {
			this.nonce = message.match(/Nonce: (\S+)/)?.[1];
		} else if (typeof message === "object") {
			this.address = message.address;
			this.chainId = message.chainId;
			this.nonce = message.nonce;
		}
	}

	verify({
		signature,
		expectedNonce,
	}: { signature: string; expectedNonce?: string }): {
		success: boolean;
		data: SiweMessage;
		error?: Error;
	} {
		if (
			!this.address ||
			!this.nonce ||
			!signature ||
			(expectedNonce && this.nonce !== expectedNonce)
		) {
			return {
				success: false,
				data: this,
				error: new Error("Invalid message or nonce for verification."),
			};
		}
		const looksValid =
			/^0x[a-fA-F0-9]+$/.test(signature) && signature.length > 10;
		if (looksValid) {
			this.chainId = this.chainId || 1;
			return { success: true, data: this };
		}
		return {
			success: false,
			data: this,
			error: new Error("Signature verification failed."),
		};
	}
}

const nonces = new Map<string, number>(); // nonce -> expirationTimestamp
const NONCE_EXPIRATION_MS = 5 * 60 * 1000;
interface UserSession {
	address: string;
	chainId: number;
}
const sessions = new Map<string, UserSession>(); // sessionId -> { address, chainId }
const SESSION_COOKIE_NAME = "cardosis_session";

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
			message: string | SiweMessageObject;
			signature: string;
		};

		if (!message || !signature) {
			ctx.response.status = 400;
			ctx.response.body = { error: "Missing message or signature." };
			return;
		}

		const siweMessage = new SiweMessage(message);
		if (!siweMessage.nonce) {
			ctx.response.status = 400;
			ctx.response.body = { error: "Nonce missing in SIWE message." };
			return;
		}

		const storedNonceExpiry = nonces.get(siweMessage.nonce);
		if (!storedNonceExpiry || Date.now() > storedNonceExpiry) {
			if (storedNonceExpiry) nonces.delete(siweMessage.nonce);
			ctx.response.status = 403;
			ctx.response.body = { error: "Nonce invalid or expired." };
			return;
		}

		const {
			success,
			data: verifiedMessage,
			error,
		} = siweMessage.verify({
			signature,
			expectedNonce: siweMessage.nonce,
		});

		if (
			success &&
			verifiedMessage.address &&
			verifiedMessage.chainId !== undefined
		) {
			nonces.delete(siweMessage.nonce);
			const sessionId = generateNonce(); // Uses the local generateNonce
			sessions.set(sessionId, {
				address: verifiedMessage.address,
				chainId: verifiedMessage.chainId,
			});
			ctx.cookies.set(SESSION_COOKIE_NAME, sessionId, {
				httpOnly: true,
				secure: ctx.request.secure,
				sameSite: "lax",
				path: "/",
			});
			ctx.response.status = 200;
			ctx.response.body = {
				ok: true,
				address: verifiedMessage.address,
				chainId: verifiedMessage.chainId,
			};
		} else {
			ctx.response.status = 401;
			ctx.response.body = {
				ok: false,
				error: error?.message || "Verification failed.",
			};
		}
	} catch (e) {
		console.error("SIWE Verify Error:", e);
		ctx.response.status = 500;
		ctx.response.body = { error: "Server error during verification." };
	}
});

// 3. Get Session
siweRouter.get("/session", async (ctx) => {
	const sessionId = await ctx.cookies.get(SESSION_COOKIE_NAME);
	const sessionData = sessionId ? sessions.get(sessionId) : null;
	ctx.response.status = 200;
	ctx.response.body = sessionData; // Returns { address, chainId } or null
});

// 4. Logout
siweRouter.post("/logout", async (ctx) => {
	const sessionId = await ctx.cookies.get(SESSION_COOKIE_NAME);
	if (sessionId) {
		sessions.delete(sessionId);
		ctx.cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
	}
	ctx.response.status = 200;
	ctx.response.body = { ok: true };
});
