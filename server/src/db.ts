import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync } from "node:fs";

const dataDir = Deno.env.get("DOCKER_ENV") === "true" ? "/app/data" : "./data";
if (!existsSync(dataDir)) {
	mkdirSync(dataDir);
}
const dbPath = `${dataDir}/base.db`;

class Database {
	private static instance: Database;
	private db: DatabaseSync;

	static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	constructor() {
		this.db = new DatabaseSync(dbPath);
		this.db.exec(
			"CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, address TEXT, chainId INTEGER, expiration INTEGER);",
		);
		this.db.exec(
			"CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, address TEXT, chainId INTEGER, card TEXT, dca TEXT, reserve TEXT, status TEXT);",
		);
	}
	close() {
		this.db.close();
	}

	// Sessions
	getSession(sessionId: string) {
		return this.db
			.prepare("SELECT address, chainId, expiration FROM sessions WHERE id = ?")
			.get(sessionId);
	}
	addSession(
		sessionId: string,
		address: string,
		chainId: number,
		expiration: number,
	) {
		this.db
			.prepare(
				"INSERT INTO sessions (id, address, chainId, expiration) VALUES (?, ?, ?, ?)",
			)
			.run(sessionId, address, chainId, expiration);
	}
	removeSession(sessionId: string) {
		this.db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
	}

	// Accounts
	getAccount(address: string, chainId: number) {
		return this.db
			.prepare(
				"SELECT address, chainId, card, dca, reserve, status FROM accounts WHERE address = ? AND chainId = ?",
			)
			.get(address, chainId);
	}
	addAccount(
		address: string,
		chainId: number,
		card: string,
		dca: string,
		reserve: string,
		status: string,
	) {
		this.db
			.prepare(
				"INSERT INTO accounts (address, chainId, card, dca, reserve, status) VALUES (?, ?, ?, ?, ?, ?)",
			)
			.run(address, chainId, card, dca, reserve, status);
	}
	updateAccount(
		address: string,
		chainId: number,
		card: string,
		dca: string,
		reserve: string,
		status: string,
	) {
		this.db
			.prepare(
				"UPDATE accounts SET card = ?, dca = ?, reserve = ?, status = ? WHERE address = ? AND chainId = ?",
			)
			.run(card, dca, reserve, status, address, chainId);
	}
	removeAccount(address: string, chainId: number) {
		this.db
			.prepare("DELETE FROM accounts WHERE address = ? AND chainId = ?")
			.run(address, chainId);
	}
}

export default Database;
