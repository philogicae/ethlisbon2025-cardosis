import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { siweRouter } from "./siwe.ts";
import Database from "./db.ts";
import SafeManager from "./safe_management/safe.ts";

// Singletons
const db = Database.getInstance();
const safeManager = SafeManager.getInstance();

// App
const app = new Application();

// CORS
app.use(
	oakCors({
		origin: [
			/localhost:\d+$/,
			"http://localhost:3000",
			"http://192.168.1.135:3000",
			"https://cardosis.on-fleek.app",
		],
		allowedHeaders: ["*"],
		credentials: true,
		optionsSuccessStatus: 200,
	}),
);

// Logger
app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.headers.get("X-Response-Time");
	console.log(
		`${new Date().toISOString().replace("T", " ").split(".")[0]} ${ctx.request.method}: ${ctx.request.url.pathname} - ${rt}`,
	);
});

// Timing
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Main API Router
const apiRouter = new Router();

// Mount SIWE routes
apiRouter.use("/api/siwe", siweRouter.routes(), siweRouter.allowedMethods());

// Require sessionId
apiRouter.use(async (ctx, next) => {
	const { address, chainId, sessionId } = await ctx.request.body.json();
	// deno-lint-ignore no-explicit-any
	const session = sessionId ? (db.getSession(sessionId) as any) : null;
	if (
		!session ||
		session?.address !== address ||
		session?.chainId !== chainId
	) {
		session && db.removeSession(sessionId);
		ctx.response.status = 401;
		ctx.response.body = { error: "Unauthorized" };
		return;
	}
	if (session.expiration < Date.now()) {
		session && db.removeSession(sessionId);
		ctx.response.status = 401;
		ctx.response.body = { error: "Session expired" };
		return;
	}
	await next();
});

apiRouter
	.post("/api/account", async (ctx) => {
		const { address, chainId } = await ctx.request.body.json();
		// deno-lint-ignore no-explicit-any
		const account: any = db.getAccount(address, chainId);
		ctx.response.body = {
			status: account?.status || "not_found",
			safes: {
				card: account?.card,
				dca: account?.dca,
				reserve: account?.reserve,
			},
		};
	})
	.post("/api/account/create", async (ctx) => {
		const { address, chainId } = await ctx.request.body.json();
		// deno-lint-ignore no-explicit-any
		const account: any = db.getAccount(address, chainId);
		if (!account) {
			try {
				db.addAccount(address, chainId, "", "", "", "creating");
				safeManager
					.createAccount(address, chainId)
					.then((safes) => {
						db.updateAccount(
							address,
							chainId,
							safes.card,
							safes.dca,
							safes.reserve,
							"created",
						);
						console.log(`Account creation completed for ${address}`, safes);
					})
					.catch((error) => {
						db.removeAccount(address, chainId);
						console.error(`Account creation failed for ${address}:`, error);
					});
				ctx.response.body = {
					status: "creating",
					message:
						"Account creation has started and will continue in the background",
				};
			} catch (error) {
				db.removeAccount(address, chainId);
				console.error("Failed to initiate account creation:", error);
				ctx.response.body = {
					status: "error",
					message: "Failed to start account creation",
				};
			}
		} else if (account.status === "creating") {
			ctx.response.body = {
				status: "creating",
				message: "Account creation is already in progress",
			};
		} else {
			ctx.response.body = {
				status: "created",
				message: "Account already created",
			};
		}
	})
	.post("/api/account/balances", async (ctx) => {
		const { address, chainId } = await ctx.request.body.json();
		ctx.response.body = {
			status: "ok",
			balances: {
				card: 150,
				dca_current: 50,
				dca_total: 100,
				reserve: 100000,
			},
		};
	})
	.post("/api/account/charts", async (ctx) => {
		const { address, chainId } = await ctx.request.body.json();
		ctx.response.body = {
			status: "ok",
			charts: [
				{ timestamp: 1746911548, card: 150, dca: 1, reserve: 1000 },
				{ timestamp: 1746915148, card: 145, dca: 1.2, reserve: 1005 },
				{ timestamp: 1746918748, card: 140, dca: 1.5, reserve: 1010 },
				{ timestamp: 1746922348, card: 135, dca: 1.7, reserve: 1015 },
				{ timestamp: 1746925948, card: 130, dca: 1.9, reserve: 1020 },
				{ timestamp: 1746929548, card: 125, dca: 2.1, reserve: 1025 },
				{ timestamp: 1746933148, card: 120, dca: 2.3, reserve: 1030 },
				{ timestamp: 1746936748, card: 115, dca: 2.5, reserve: 1035 },
				{ timestamp: 1746940348, card: 110, dca: 2.7, reserve: 1040 },
				{ timestamp: 1746943948, card: 105, dca: 2.9, reserve: 1045 },
				{ timestamp: 1746947548, card: 100, dca: 3.1, reserve: 1050 },
				{ timestamp: 1746951148, card: 200, dca: 3.3, reserve: 950 },
				{ timestamp: 1746954748, card: 195, dca: 3.5, reserve: 960 },
				{ timestamp: 1746958348, card: 190, dca: 3.7, reserve: 965 },
				{ timestamp: 1746961948, card: 185, dca: 3.9, reserve: 970 },
				{ timestamp: 1746965548, card: 180, dca: 4.1, reserve: 975 },
				{ timestamp: 1746969148, card: 175, dca: 4.3, reserve: 980 },
				{ timestamp: 1746972748, card: 170, dca: 4.5, reserve: 985 },
				{ timestamp: 1746976348, card: 165, dca: 4.7, reserve: 990 },
				{ timestamp: 1746979948, card: 160, dca: 5.0, reserve: 1000 },
			],
		};
	})
	.post("/api/account/transactions", async (ctx) => {
		const { address, chainId } = await ctx.request.body.json();
		const timestamp = Date.now();
		ctx.response.body = {
			status: "ok",
			transactions: [
				{
					type: "scheduled",
					from_account: "reserve",
					to_account: "dca",
					details: {
						token_in: "EURe",
						amount_in: 10,
						token_out: "WETH",
						amount_out: 0.005,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 2,
					status: "pending",
				},
				{
					type: "withdraw",
					from_account: "reserve",
					to_account: "wallet",
					details: {
						token_in: "EURe",
						amount_in: 100,
						token_out: "",
						amount_out: 0,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 2,
					status: "pending",
				},
				{
					type: "transfer",
					from_account: "reserve",
					to_account: "card",
					details: {
						token_in: "EURe",
						amount_in: 10,
						token_out: "EURe",
						amount_out: 10,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 3,
					status: "executed",
				},
				{
					type: "saving",
					from_account: "card",
					to_account: "dca",
					details: {
						token_in: "EURe",
						amount_in: 0.5,
						token_out: "WETH",
						amount_out: 0.0001,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 6 - 1,
					status: "executed",
				},
				{
					type: "spend",
					from_account: "card",
					to_account: "gnosispay",
					details: {
						token_in: "EURe",
						amount_in: 7.5,
						token_out: "",
						amount_out: 0,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 6,
					status: "executed",
				},
				{
					type: "saving",
					from_account: "card",
					to_account: "dca",
					details: {
						token_in: "EURe",
						amount_in: 0.5,
						token_out: "WETH",
						amount_out: 0.0001,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 12 - 1,
					status: "executed",
				},
				{
					type: "spend",
					from_account: "card",
					to_account: "gnosispay",
					details: {
						token_in: "EURe",
						amount_in: 6.5,
						token_out: "",
						amount_out: 0,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 12,
					status: "executed",
				},
				{
					type: "saving",
					from_account: "card",
					to_account: "dca",
					details: {
						token_in: "EURe",
						amount_in: 0.5,
						token_out: "WETH",
						amount_out: 0.0001,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 24 - 1,
					status: "executed",
				},
				{
					type: "spend",
					from_account: "card",
					to_account: "gnosispay",
					details: {
						token_in: "EURe",
						amount_in: 5.5,
						token_out: "",
						amount_out: 0,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 24,
					status: "executed",
				},
				{
					type: "deposit",
					from_account: "wallet",
					to_account: "reserve",
					details: {
						token_in: "",
						amount_in: 0,
						token_out: "EURe",
						amount_out: 500,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 47,
					status: "executed",
				},
				{
					type: "deposit",
					from_account: "wallet",
					to_account: "card",
					details: {
						token_in: "",
						amount_in: 0,
						token_out: "EURe",
						amount_out: 50,
					},
					timestamp: timestamp - 1000 * 60 * 60 * 48,
					status: "executed",
				},
			],
		};
	})
	.post("/api/mock/spend", async (ctx) => {
		const { address, chainId, amount } = await ctx.request.body.json();
		try {
			safeManager.transferTokens(
				address,
				chainId,
				"card",
				"gnosispay",
				"EURe",
				amount,
			);
		} catch (error) {
			console.error("Failed to initiate mock spend:", error);
			ctx.response.status = 500;
			ctx.response.body = {
				status: "error",
				message: "Failed to initiate mock spend",
			};
			return;
		}
		ctx.response.body = {
			status: "ok",
			message: "Mock spending initiated",
		};
	});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

console.log("Running on http://localhost:8000");
await app.listen({ port: 8000 });
