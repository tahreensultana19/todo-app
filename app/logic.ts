// app/todo/route.ts
export async function GET() {
  try {
    // Fetch all to-do items from the local API route
    const response = await fetch("http://localhost:3000/api/todo", {
      method: "GET", // Using the GET method
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch to-dos");
    }

    const todos = await response.json();
    return new Response(JSON.stringify(todos), { status: 200 });
  } catch (error) {
    console.error("Error fetching to-dos:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    // Read the incoming request body
    const { task, due_date } = await req.json();

    if (!task || !due_date) {
      return new Response(
        JSON.stringify({ message: "Task and due date are required" }),
        { status: 400 }
      );
    }

    // Send a POST request to the local API route to add the to-do
    const response = await fetch("http://localhost:3000/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task, due_date }),
    });

    if (!response.ok) {
      throw new Error("Failed to add to-do");
    }

    const newTodo = await response.json();
    return new Response(
      JSON.stringify({ message: "To-Do added successfully", todo: newTodo }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to-do:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
