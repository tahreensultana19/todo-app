import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

<<<<<<< HEAD
// Create the Pool with environment variables
export const pool = new Pool({
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // port: 5432, // Default PostgreSQL port
  // database: process.env.DB_DATABASE,
});

=======


export const pool = new Pool({
    host: 'dpg-cstabbrtq21c73a8rnv0-a.oregon-postgres.render.com',
    user: 'todo_app_dlk6_user',
    password: '77qkuB3mmGeoAFzyX69nC98lBKr4JwPp',
    port: 5432, 
    database: 'todo_app_dlk6',
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000, 
    ssl: {
      rejectUnauthorized: false, 
    }
  });
>>>>>>> c71a2b1e137894e307aaa0bd0521d71bbfcfd83a
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