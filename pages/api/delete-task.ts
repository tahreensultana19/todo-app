import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg"; // Import Pool instead of Client
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("Please add your PostgreSQL URI to .env.local");
}

// Create a new Pool instance
const pool = new Pool({
  connectionString,
});

export default async function deleteTask(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;

  // Validate the ID
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    // Use the pool to execute the query
    const result = await pool.query(
      "DELETE FROM todo WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}