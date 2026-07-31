import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

const pool = new Pool({
    connectionString: env.databaseUrl,
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("PostgreSQL connected successfully.");
        client.release();
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};
export { pool, connectDB };