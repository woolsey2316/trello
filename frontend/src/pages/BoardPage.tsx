import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useState } from "react";
import { authFetcher } from "../api/client.js";
import List from "../components/List.js";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type Card = { id: string; text: string };
type ListType = { id: string; title: string; cards: Card[] };

const BoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: board, isLoading, error } = useSWR(
    `${API}/api/boards/${id}`,
    authFetcher
  );

  const [lists, setLists] = useState<ListType[]>([]);
  const [addingList, setAddingList] = useState(false);
  const [listTitle, setListTitle] = useState("");

  const handleAddList = () => {
    if (listTitle.trim()) {
      setLists([
        ...lists,
        { id: crypto.randomUUID(), title: listTitle.trim(), cards: [] },
      ]);
      setListTitle("");
      setAddingList(false);
    }
  };

  const handleAddCard = (listId: string, text: string) => {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? { ...list, cards: [...list.cards, { id: crypto.randomUUID(), text }] }
          : list
      )
    );
  };

  if (isLoading) return <div className="min-h-screen bg-blue-700 p-6 text-white">Loading…</div>;
  if (error) return <div className="min-h-screen bg-blue-700 p-6 text-red-300">Board not found.</div>;

  return (
    <div className="min-h-screen bg-blue-700 p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-white/70 hover:text-white text-sm"
        >
          ← Boards
        </button>
        <h1 className="text-white text-xl font-bold">{board?.name}</h1>
      </div>

      <div className="flex gap-4 items-start overflow-x-auto pb-4">
        {lists.map((list) => (
          <List key={list.id} list={list} onAddCard={handleAddCard} />
        ))}

        {addingList ? (
          <div className="bg-gray-100 rounded-xl w-64 shrink-0 p-3 flex flex-col gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Enter list title..."
              className="w-full rounded-lg border border-blue-400 px-3 py-2 text-sm focus:outline-none"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddList();
                if (e.key === "Escape") setAddingList(false);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddList}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg"
              >
                Add list
              </button>
              <button
                onClick={() => {
                  setAddingList(false);
                  setListTitle("");
                }}
                className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingList(true)}
            className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl w-64 shrink-0 px-4 py-3 text-left"
          >
            + Add a list
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardPage;
