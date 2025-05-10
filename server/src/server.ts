import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { siweRouter } from "./siwe.ts";
import Database from "./db.ts";

// Quick db test
const db = new Database();
const rows = db.getAllPeople();
console.log(rows);
db.close();

const app = new Application();
app.proxy = true; // Trust proxy headers (e.g., X-Forwarded-Proto for secure cookies)

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

// Define other API routes directly on apiRouter
apiRouter
	.get("/api", (ctx) => {
		ctx.response.body = "API Root";
	})
	.get("/api/get/:text", (ctx) => {
		const { text } = ctx.params;
		ctx.response.body = { text };
	})
	.post("/api/post", async (ctx) => {
		const { test } = await ctx.request.body.json();
		ctx.response.body = { test, status: "ok" };
	})
	.post("/api/account", async (ctx) => {
		const { address } = await ctx.request.body.json();
		ctx.response.body = {
			status: "ok",
			accounts: {
				card: address,
				dca: address,
				reserve: address,
			},
		};
	})
	.post("/api/account/balances", async (ctx) => {
		const { address } = await ctx.request.body.json();
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
	.post("/api/account/transactions", async (ctx) => {
		const { address } = await ctx.request.body.json();
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
	});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

console.log("Running on http://localhost:8000");
await app.listen({ port: 8000 });
