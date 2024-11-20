import { useState, useEffect } from "react";
import { Task } from "../types";

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // State to store error messages

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/get-task");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching tasks: ${errorText}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      // Type assertion to handle the error properly
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(errorMessage);
      setError(errorMessage); // Set error message for user feedback
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task: string) => {
    if (!task.trim()) {
      console.error("Task cannot be empty");
      setError("Task cannot be empty."); // Set error for user feedback
      return; // Prevent sending an empty task
    }

    const newTask = {
      task,
      status: false,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error adding task: ${errorText}`);
      }

      const addedTask = await response.json();
      setTasks([addedTask, ...tasks]); // Add the new task to the top of the list
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error adding task:", errorMessage);
      setError(errorMessage); // Set error for user feedback
    }
  };

  const editTask = (id: number, task: string): void => {
    setEditingTaskId(id);
    setEditedTask(task);
  };

  const saveTask = async (id: number, updates: Partial<Task>) => {
    try {
      const existingTask = tasks.find((task) => task.id === id);
      if (!existingTask) {
        throw new Error("Task not found");
      }

      const response = await fetch(`/api/update-task?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...existingTask, ...updates }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating task: ${errorText}`);
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task)),
      );
      await fetchTasks(); // Refresh tasks
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error saving task:", errorMessage);
      setError(errorMessage); // Set error for user feedback
    }
    setEditingTaskId(null);
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/delete-task?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error deleting task: ${errorText}`);
      }

      setTasks(tasks.filter((task) => task.id !== id));
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error deleting task:", errorMessage);
      setError(errorMessage); // Set error for user feedback
    }
  };

  return {
    tasks,
 addTask,
    editingTaskId,
    editedTask,
    editTask,
    saveTask,
    deleteTask,
    setEditedTask,
    error, // Expose error state for user feedback
  };
};

export default useTasks;