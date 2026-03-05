import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { authFetcher, authFetch } from './client.js';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

import { type Card } from './cards.js';

export type List = {
  _id: string;
  name: string;
  boardId: string;
  userId: string;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
};

/** hooks */
export const useLists = (boardId: string) =>
  useSWR<List[]>(`${API}/api/lists/board/${boardId}`, authFetcher);

export const useAddList = () =>
  useSWRMutation(
    "addList",
    (_key, { arg }: { arg: { boardId: string; title: string, userId: string } }) =>
      createList(arg)
  );

export const createList = ({ boardId, title, userId }: { boardId: string, title: string, userId: string }) =>
  authFetch(`${API}/api/lists`, {
    method: "POST",
    body: JSON.stringify({ boardId, title, userId }),
  }).then((r) => r.json());
