"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import useTasks from "../hooks/useTasks";
import { Task } from "../types";
import { SearchBar } from "./searchbar";



const TaskTable = () => {
  const {
    tasks,
    addTask,
    editingTaskId,
    editedTask,
    editTask,
    saveTask,
    deleteTask,
    setEditedTask,
    loading,
  } = useTasks();

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleSearchResults = (results: Task[]) => {
    setFilteredTasks(results);
  };

  const handleBlur = (id: number) => {
    saveTask(id, { task: editedTask });
  };

  const handleStatusChange = async (task: Task) => {
    const updatedTask = { ...task, status: !task.status };
    await saveTask(task.id, { status: updatedTask.status });
    setFilteredTasks((prevTasks: Task[]) =>
      prevTasks.map((t: Task) => (t.id === task.id ? updatedTask : t)),
    );
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <TableContainer>
      <div className="m-2 flex items-center justify-between">
      <SearchBar tasks={tasks} onSearchResults={handleSearchResults} />

        <Button variant="contained" color="success" onClick={() => addTask("New task")}>
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
                  onChange={() => saveTask(task.id, { status: !task.status })}
                />
              </TableCell>
              <TableCell>
                {editingTaskId === task.id ? (
                  <TextField
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    onBlur={() => saveTask(task.id, { task: editedTask })}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => editTask(task.id, task.task)} style={{ cursor: "pointer" }}>
                    {task.task}
                  </span>
                )}
              </TableCell>
              <TableCell>{task.status ? "Completed" : "Pending"}</TableCell>
              <TableCell>{task.date}</TableCell>
              <TableCell>
                <Button variant="outlined" color="error" onClick={() => deleteTask(task.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;