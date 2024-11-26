import { sql } from "@vercel/postgres";
type GetTasks = {
  id: number;
  task: string;
  status: string;
  date: string;
};

type AddTask = {
  task: string;
  status: boolean;
  date: string;
};

type UpdateTask = {
  id: number;
  task: string;
};

type DeleteTask = {
  id: number;
};

export async function GetTasks() {
  let data = await sql<GetTasks>`SELECT *FROM todo`;
  return data.rows;
}

export async function AddTask(task: string, status: boolean, date: string) {
  await sql`INSERT INTO todo (task, status, date) VALUES (${task}, ${status}, ${date})`;
}

export async function UpdateTask(id: number, task: string) {
  await sql`UPDATE todo SET task = ${task} WHERE id = ${id}`;
}

export async function DeleteTask(id: number) {
  await sql`DELETE FROM todo WHERE id = ${id}`;
}
