import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export async function connectDatabase() {
  const client = await pool.connect();

  try {
    await client.query("SELECT NOW()");
    console.log("PostgreSQL Connected");
  } finally {
    client.release();
  }
}