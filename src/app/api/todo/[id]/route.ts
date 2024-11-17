import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../lib/db"; // Ensure this file exports correctly

// Define the response type for better clarity
interface ApiResponse {
  message?: string;
  task?: any; // You can replace 'any' with a more specific type if you have one
}

// PUT request to update a todo by id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const { id } = params; // Access params directly
  const { task_name }: { task_name?: string } = await req.json();

  // Check if task_name is provided
  if (!task_name) {
    return NextResponse.json(
      { message: "Task name is required" },
      { status: 400 }
    );
  }

  try {
    const res = await pool.query(
      "UPDATE todos SET task_name = $1 WHERE id = $2 RETURNING *",
      [task_name, id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Returning the updated task as a response
    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE request to delete a todo by id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const { id } = params; // Access params directly

  try {
    const res = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Task deleted successfully", task: res.rows[0] },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting task:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Failed to delete task", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to delete task", error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}