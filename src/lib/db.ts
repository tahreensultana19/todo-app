import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    host: 'dpg-cstabbrtq21c73a8rnv0-a.oregon-postgres.render.com',
    user: 'todo_app_dlk6_user',
    password: '77qkuB3mmGeoAFzyX69nC98lBKr4JwPp',
    port: 5432, // Default PostgreSQL port
    database: 'todo_app_dlk6',
    idleTimeoutMillis: 30000, // timeout in ms before idle connections are closed
    connectionTimeoutMillis: 2000, // timeout for acquiring a connection
    ssl: {
      rejectUnauthorized: false, // Accept self-signed certificates, if needed
    }
  });
export const connectToDb = async () => {
  try {
    await pool.connect();
    console.log("Connected to the PostgreSQL database.");
  } catch (error) {
    console.error("Error connecting to database", error);
  }
};

export const disconnectDb = async () => {
  try {
    await pool.end();
    console.log("Connection closed.");
  } catch (error) {
    console.error("Error disconnecting from database", error);
  }
};

export const testDbConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connection test:", res.rows[0]);
  } catch (error) {
    console.error("Error during database connection test", error);
  }
};