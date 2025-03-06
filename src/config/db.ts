import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg; // ✅ Use destructuring for ESM compatibility

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

export default pool;
