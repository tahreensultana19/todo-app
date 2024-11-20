import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("Please add your PostgreSQL URI to .env.local");
}

const pool = new Pool({
  connectionString,
});

export default async function addTask(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { task, status, date } = req.body;

  if (
    typeof task !== "string" ||
    typeof status !== "boolean" ||
    typeof date !== "string"
  ) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO todo (task, status, date) VALUES ($1, $2, $3) RETURNING *",
      [task, status, date],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Failed to add task" });
  }
}