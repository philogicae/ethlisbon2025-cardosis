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
	.post("/api/account/transactions", async (ctx) => {
		const { address } = await ctx.request.body.json();
		const timestamp = Date.now();
		ctx.response.body = {
			status: "ok",
			transactions: [
				{
					type: "withdraw", // reserve account -> wallet
					account: "reserve",
					currency: "EURe",
					amount: 100,
					timestamp: timestamp - 1000 * 60 * 60 * 2,
				},
				{
					type: "transfer", // reserve account -> card account
					currency: "EURe",
					from_account: "reserve",
					to_account: "card",
					amount: 10,
					timestamp: timestamp - 1000 * 60 * 60 * 3,
				},
				{
					type: "spend",
					currency: "EURe",
					amount: 7.5,
					timestamp: timestamp - 1000 * 60 * 60 * 6,
				},
				{
					type: "spend",
					currency: "EURe",
					amount: 6.5,
					timestamp: timestamp - 1000 * 60 * 60 * 12,
				},
				{
					type: "spend",
					currency: "EURe",
					amount: 5.5,
					timestamp: timestamp - 1000 * 60 * 60 * 24,
				},
				{
					type: "deposit", // wallet -> reserve account
					account: "reserve",
					currency: "EURe",
					amount: 500,
					timestamp: timestamp - 1000 * 60 * 60 * 47,
				},
				{
					type: "deposit", // wallet -> card account
					account: "card",
					currency: "EURe",
					amount: 50,
					timestamp: timestamp - 1000 * 60 * 60 * 48,
				},
			],
		};
	});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

console.log("Running on http://localhost:8000");
await app.listen({ port: 8000 });
