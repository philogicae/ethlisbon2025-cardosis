import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync } from "node:fs";

const dataDir = Deno.env.get("DOCKER_ENV") === "true" ? "/app/data" : "./data";
if (!existsSync(dataDir)) {
	mkdirSync(dataDir);
}
const dbPath = `${dataDir}/base.db`;

class Database {
	private db: DatabaseSync;

	constructor() {
		this.db = new DatabaseSync(dbPath);
		this.db.exec(
			"CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);",
		);
		this.db.prepare("INSERT INTO people (name) VALUES (?)").run("Bob");
	}

	getAllPeople() {
		return this.db.prepare("SELECT id, name FROM people").all();
	}

	close() {
		this.db.close();
	}
}

export default Database;
