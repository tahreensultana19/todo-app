import { NextResponse } from "next/server";
import { Pool } from "pg";

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET() {
  console.log("GET request to /api/todo");
  try {
    const res = await pool.query("SELECT * FROM todo");
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

// POST method to add a new to-do
export async function POST(req: Request) {
  try {
    const { task, due_date } = await req.json();
    const res = await pool.query(
      "INSERT INTO todo (task, due_date) VALUES ($1, $2) RETURNING *",
      [task, due_date]
    );
    return NextResponse.json({
      message: "To-Do task added successfully",
      todo: res.rows[0],
    });
  } catch (error) {
    return NextResponse.error();
  }
}
