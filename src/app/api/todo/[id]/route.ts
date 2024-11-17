import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../lib/db";

/**
 * Updates a to-do task by its ID.
 * 
 * @param req - The incoming PUT request.
 * @param context - The context containing route parameters.
 * @returns JSON response with the updated task or an error message.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } } // Destructure params here
) {
  const { id } = params; // Access params directly
  const { task_name }: { task_name?: string } = await req.json();

  if (!task_name) {
    return NextResponse.json(
      { message: "Task name is required to update the task." },
      { status: 400 }
    );
  }

  try {
    const res = await pool.query(
      "UPDATE todos SET task_name = $1 WHERE id = $2 RETURNING *",
      [task_name, id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ message: "No task found with the given ID." }, { status: 404 });
    }

    // Returning the updated task as a response
    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while updating the task." },
      { status: 500 }
    );
  }
}

/**
 * Deletes a to-do task by its ID.
 * 
 * @param req - The incoming DELETE request.
 * @param context - The context containing route parameters.
 * @returns JSON response with a success or error message.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Access params directly

  try {
    const res = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ message: "No task found with the given ID." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while deleting the task." },
      { status: 500 }
    );
  }
}

