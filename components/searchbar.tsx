import React, { useState } from "react";
import { Task } from "../types";

interface SearchBarProps {
  tasks: Task[];
  onSearchResults: (results: Task[]) => void;
}

export function SearchBar({ tasks, onSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    const filteredTasks = tasks.filter(
      (task) =>
        task.task.toLowerCase().includes(value.toLowerCase()) ||
        task.id.toString().includes(value),
    );
    onSearchResults(filteredTasks);
  };

  return (
    <form>
      <label htmlFor="default-search">
        Search
      </label>
      <div>
        <input
          type="text"
          id="default-search"
          placeholder="Search tasks..."
          value={query}
          onChange={handleSearch}
        />
      </div>
    </form>
  );
}