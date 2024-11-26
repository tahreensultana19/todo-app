"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { AddTask, UpdateTask, DeleteTask, GetTasks } from "../lib/data";
import { Task } from "../types";
import { SearchBar } from "./searchbar";
import Loading from "../app/loading";
import { Suspense } from "react";

interface TableComponentProps {
  tasks: Task[];
}
const TableComponent: React.FC<TableComponentProps> = ({ tasks }) => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<string>("");

  useEffect(() => {
    updateTasks();
  }, [tasks]);

  const updateTasks = async () => {
    const fetchedTasks = await GetTasks();
    if (!fetchedTasks) return;
    const updatedTasks: Task[] = fetchedTasks.map((task) => ({
      ...task,
      status: false, // Use the actual status from the database
      date: new Date(task.date).toISOString(), // Convert date to ISO string
    }));
    setTaskList(updatedTasks);
    setFilteredTasks(updatedTasks);
  };

  const handleAddTask = async (task: string) => {
    if (!task.trim()) {
      console.error("Task cannot be empty");
      return;
    }

    const date = new Date().toISOString();
    await AddTask(task, false, date); // Provide a default value for status and date
    await updateTasks();
  };

  const handleEditTask = (id: number, task: string): void => {
    setEditingTaskId(id);
    setEditedTask(task);
  };

  const handleSaveTask = async (id: number, updates: Partial<Task>) => {
    await UpdateTask(id, updates.task || "");
    await updateTasks();
    setEditingTaskId(null);
  };

  const handleDeleteTask = async (id: number): Promise<void> => {
    await DeleteTask(id);
    await updateTasks();
    console.log("Task deleted successfully");
  };

  const handleSearchResults = (results: Task[]) => {
    setFilteredTasks(results);
  };

  const handleBlur = (id: number) => {
    handleSaveTask(id, { task: editedTask });
  };

  const handleStatusChange = async (task: Task) => {
    const updatedTask = { ...task, status: !task.status };

    await handleSaveTask(task.id, { status: updatedTask.status });
    setFilteredTasks((prevTasks: Task[]) =>
      prevTasks.map((t: Task) => (t.id === task.id ? updatedTask : t)),
    );
  };

  return (
    <Suspense fallback={<Loading />}>
      <TableContainer>
        <div className="m-2 flex items-center justify-between">
          <SearchBar tasks={taskList} onSearchResults={handleSearchResults} />

          <Button
            variant="contained"
            color="success"
            onClick={() => handleAddTask("New task")}
          >
            Add new task +
          </Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={task.status}
                    onChange={() => handleStatusChange(task)}
                  />
                </TableCell>
                <TableCell>
                  {editingTaskId === task.id ? (
                    <TextField
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                      onBlur={() => handleBlur(task.id)}
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => handleEditTask(task.id, task.task)}
                      style={{ cursor: "pointer" }}
                    >
                      {task.task}
                    </span>
                  )}
                </TableCell>
                <TableCell>{task.status ? "Completed" : "Pending"}</TableCell>
                <TableCell>{task.date}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Suspense>
  );
};

export default TableComponent;