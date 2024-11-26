import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const connectionString = process.env.POSTGRES_URL;
const pool = new Pool({ connectionString });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "PUT") {
    const { id } = req.query;
    const { task, status } = req.body;

    const client = await pool.connect();
    try {
      // Fetch the existing task to ensure the task field is not null
      const existingTaskResult = await client.query(
        "SELECT task FROM todo WHERE id = $1",
        [id],
      );

      if (existingTaskResult.rows.length === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      const existingTask = existingTaskResult.rows[0].task;

      const result = await client.query(
        "UPDATE todo SET task = $1, status = $2 WHERE id = $3 RETURNING *",
        [task || existingTask, status, id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } finally {
      client.release(); // Ensure the client is released back to the pool
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}