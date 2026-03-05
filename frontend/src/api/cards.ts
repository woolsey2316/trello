import useSWRMutation from 'swr/mutation';
import { authFetch } from './client.js';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type ChecklistItem = {
  _id?: string;
  text: string;
  done: boolean;
};

export type Card = {
  _id: string;
  title: string;
  description?: string;
  attachmentPath?: string;
  assignedTo?: string[];
  labels?: { value: string, colourClass: string, text: string, textColor: string }[];
  dueDate?: string;
  checklist?: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
};

export const addCardToList = (listId: string, title: string) =>
  authFetch(`${API}/api/lists/${listId}/cards`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  }).then((r) => r.json());

export const updateCard = (cardId: string, data: Partial<Card>) =>
  authFetch(`${API}/api/cards/${cardId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const uploadAttachment = (cardId: string, file: File) => {
  const form = new FormData();
  form.append('file', file);
  const token = localStorage.getItem('auth_token');
  return fetch(`${API}/api/cards/${cardId}/attachment`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  }).then((r) => r.json());
};

export const moveCard = (cardId: string, fromListId: string, toListId: string, toIndex?: number) =>
  authFetch(`${API}/api/lists/move/${cardId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fromListId, toListId, toIndex }),
  }).then((r) => r.json());

export const useAddCardToList = () =>
  useSWRMutation(
    'addCardToList',
    (_key, { arg }: { arg: { listId: string; title: string } }) =>
      addCardToList(arg.listId, arg.title)
  );

export const useUpdateCard = () =>
  useSWRMutation(
    'updateCard',
    (_key, { arg }: { arg: { cardId: string; data: Partial<Card> } }) =>
      updateCard(arg.cardId, arg.data)
  );
