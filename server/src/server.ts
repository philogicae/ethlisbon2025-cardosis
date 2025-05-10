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
app.use(
	oakCors({
		origin: [
			/localhost:\d+$/,
			"http://localhost:3000",
			"https://cardosis.on-fleek.app",
		],
		credentials: true,
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
	});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

console.log("Running on http://localhost:8000");
await app.listen({ port: 8000 });
