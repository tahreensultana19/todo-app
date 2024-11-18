import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../lib/db";



// GET all list of todos
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM todos");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error in get all route:", error);
    return NextResponse.json(
      { error: "Failed to retrieve tasks" },
      { status: 500 }
    );
  }
}
// DELETE request to delete a todo by id
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params; // Access `params` from `context` explicitly

  try {
    const res = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Failed to delete task" },
      { status: 500 }
    );
  }
}