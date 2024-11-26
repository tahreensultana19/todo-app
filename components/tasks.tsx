import { GetTasks } from "../lib/data";
import TableComponent from "./table";
import { Task } from "../types";
import { Suspense } from "react";
import Loading from "../app/loading";

const Tasks = async () => {
  try {
    // Fetch tasks from the backend
    const fetchedTasks = await GetTasks();
    if (!fetchedTasks) {
      throw new Error("No tasks fetched");
    }
    const tasks: Task[] = fetchedTasks.map((task) => ({
      ...task,
      status: false,
      date: new Date(task.date).toISOString(),
    }));
    tasks.sort((a, b) => (a.date > b.date ? 1 : -1)); // Sort tasks by date

    // Pass the tasks to the TableComponent
    const RenderTableComponent = () => {
      return <TableComponent tasks={tasks} />;
    };

    // Render the component with the initial tasks
    return (
      <Suspense fallback={<Loading />}>
        <RenderTableComponent />
      </Suspense>
    );
  } catch (error) {
    return <div>Error: {String(error)}</div>;
  }
};

export default Tasks;