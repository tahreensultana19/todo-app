"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
// import { SearchBar } from "./searchbar";
import useTasks from "../hooks/useTasks";
import { Task } from "../types";

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

  return (
    <TableContainer>
      <div className="m-2 flex items-center justify-between">
        {/* <SearchBar tasks={tasks} onSearchResults={handleSearchResults} /> */}
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
                  onChange={() => handleStatusChange(task)}
                />
              </TableCell>
              <TableCell>
                {editingTaskId === task.id ? (
                  <TextField
                    value={editedTask}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedTask(e.target.value)}
                    onBlur={() => handleBlur(task.id)}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => editTask(task.id, task.task)} style={{ cursor: 'pointer' }}>
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