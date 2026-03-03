import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  type Board,
} from "../api/boards.js";

const BoardsPage = () => {
  const { data: boards, error, isLoading, mutate } = useBoards();
  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const board = await createBoard(newName.trim());
    mutate([...(boards ?? []), board]);
    setNewName("");
    setCreating(false);
  };

  const handleUpdate = async (board: Board) => {
    if (!editName.trim() || editName.trim() === board.name) {
      setEditingId(null);
      return;
    }
    const updated = await updateBoard(board._id, editName.trim());
    mutate(boards?.map((b) => (b._id === board._id ? updated : b)));
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteBoard(id);
    mutate(boards?.filter((b) => b._id !== id));
  };

  const startEdit = (board: Board) => {
    setEditingId(board._id);
    setEditName(board.name);
  };

  return (
    <div className="min-h-screen bg-blue-700 p-8">
      <h1 className="text-white text-2xl font-bold mb-8">My Boards</h1>

      {isLoading && <p className="text-white/70">Loading boards…</p>}
      {error && <p className="text-red-300">Failed to load boards.</p>}

      <div className="flex flex-wrap gap-4">
        {boards?.map((board) => (
          <div
            key={board._id}
            onClick={() => navigate(`/board/${board._id}`)}
            className="bg-white/20 hover:bg-white/30 rounded-xl w-48 h-28 p-3 cursor-pointer relative group"
          >
            {editingId === board._id ? (
              <input
                autoFocus
                className="w-full rounded px-2 py-1 text-sm text-gray-800 focus:outline-none"
                value={editName}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdate(board);
                  if (e.key === "Escape") setEditingId(null);
                }}
                onBlur={() => handleUpdate(board)}
              />
            ) : (
              <p className="text-white font-semibold text-sm">{board.name}</p>
            )}

            <div
              className="absolute bottom-2 right-2 hidden group-hover:flex gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => startEdit(board)}
                className="bg-white/30 hover:bg-white/50 text-white text-xs px-2 py-1 rounded"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(board._id)}
                className="bg-red-500/70 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {creating ? (
          <div className="bg-gray-100 rounded-xl w-48 h-28 p-3 flex flex-col gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Board title…"
              className="w-full rounded border border-blue-400 px-2 py-1 text-sm focus:outline-none"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setCreating(false);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setCreating(false);
                  setNewName("");
                }}
                className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl w-48 h-28 flex items-center justify-center"
          >
            + Create board
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardsPage;
