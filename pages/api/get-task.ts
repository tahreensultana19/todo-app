
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("Please add your PostgreSQL URI to .env.local");
}

let cachedClient: Client | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new Client({
    connectionString,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export default async function getTasks(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const client = await connectToDatabase();
    const result = await client.query(
      "SELECT id, task, status, date FROM todo",
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}