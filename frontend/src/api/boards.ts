import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { authFetch, authFetcher } from "./client.js";
import { type List } from "./lists.js";
const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type Board = {
  _id: string;
  name: string;
  description?: string;
  lists?: List[];
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type AddListToBoardArgs = { id: string; userId: string, name: string };
/** hooks */
export const useBoards = (userId: string) =>
  useSWR<Board[]>(`${API}/api/boards/user/${userId}`, authFetcher);

export const useBoard = (boardId: string, userId: string) =>
  useSWR<Board>(`${API}/api/boards/${boardId}/user/${userId}`, authFetcher);

export function useAddListToBoard() {
  return useSWRMutation(
    "addListToBoard",
    (_key, { arg }: { arg: AddListToBoardArgs }) => addListToBoard(arg)
  );
}

export const createBoard = (name: string, userId: string) =>
  authFetch(`${API}/api/boards`, {
    method: "POST",
    body: JSON.stringify({ name, userId }),
  }).then((r) => r.json());

export const addListToBoard = ({ id, name, userId }: { id: string, userId: string, name: string }) =>
  authFetch(`${API}/api/boards/${id}`, {
    method: "PUT",
    body: JSON.stringify({ userId, name }),
  }).then((r) => r.json());

export const updateBoardName = ({ id, name, userId }: { id: string, name: string, userId: string }) =>
  authFetch(`${API}/api/boards/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name, userId }),
  }).then((r) => r.json());

export const deleteBoard = (id: string, userId: string) =>
  authFetch(`${API}/api/boards/${id}/user/${userId}`, { method: "DELETE" }).then((r) =>
    r.json()
  );
