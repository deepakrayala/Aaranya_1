import { Pool } from "pg";
import { env } from "../config/env.js";

export const db = new Pool({
  connectionString: env.databaseUrl,
});

export async function checkDatabaseConnection(): Promise<void> {
  await db.query("SELECT 1");
}

export async function closeDatabaseConnection(): Promise<void> {
  await db.end();
}
