import { useState, useEffect } from "react";
import { Task } from "../types";

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-task");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching tasks: ${errorText}`);
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task: string) => {
    if (!task.trim()) {
      console.error("Task cannot be empty");
      setError("Task cannot be empty.");
      return;
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
      setTasks([addedTask, ...tasks]);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error adding task:", errorMessage);
      setError(errorMessage);
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

      const response = await fetch(`/api/update-task?id=${id}`,{
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
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error saving task:", errorMessage);
      setError(errorMessage);
    } finally {
      setEditingTaskId(null);
    }
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

      setTasks((tasks) => tasks.filter((task) => task.id !== id));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error deleting task:", errorMessage);
      setError(errorMessage);
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
    error,
    loading,
  };
};

export default useTasks;