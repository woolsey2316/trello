import useSWR from "swr";
import { authFetch, authFetcher } from "./client.js";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type Board = {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export const useBoards = () =>
  useSWR<Board[]>(`${API}/api/boards`, authFetcher);

export const createBoard = (name: string) =>
  authFetch(`${API}/api/boards`, {
    method: "POST",
    body: JSON.stringify({ name }),
  }).then((r) => r.json());

export const updateBoard = (id: string, name: string) =>
  authFetch(`${API}/api/boards/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  }).then((r) => r.json());

export const deleteBoard = (id: string) =>
  authFetch(`${API}/api/boards/${id}`, { method: "DELETE" }).then((r) =>
    r.json()
  );
