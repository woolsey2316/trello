import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAddListToBoard, useBoard } from "../api/boards.js";
import { useAddCardToList, moveCard, type Card } from "../api/cards.js";
import List from "../components/List.js";
import EditCardModal from "../modals/EditCardModal.js";
import useAuthRedirect from "../hooks/useAuthRedirect.js";

const BoardPage = () => {
  const userId = useAuthRedirect();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: board, mutate: mutateBoard } = useBoard(id!, userId!);
  const { isMutating, error, data: updatedBoard, trigger } = useAddListToBoard();
  const { trigger: triggerAddCard } = useAddCardToList();
  const [addingList, setAddingList] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const dragInfo = useRef<{ cardId: string; fromListId: string } | null>(null);

  const handleCardDragStart = (cardId: string, fromListId: string) => {
    dragInfo.current = { cardId, fromListId };
  };

  const handleCardDrop = (toListId: string, toIndex: number) => {
    const info = dragInfo.current;
    if (!info) return;
    dragInfo.current = null;
    moveCard(info.cardId, info.fromListId, toListId, toIndex).then(() => mutateBoard());
  };

  const handleAddList = () => {
    if (listTitle.trim()) {
      trigger({
        id: id!,
        name: listTitle.trim(),
        userId: userId!,
      });
      setListTitle("");
      setAddingList(false);
    }
  };

  const handleAddCard = (listId: string, text: string) => {
    triggerAddCard({ listId, title: text }).then(() => mutateBoard());
  };

  if (isMutating) return <div className="min-h-screen bg-blue-700 p-6 text-white">Loading…</div>;
  if (error) return <div className="min-h-screen bg-blue-700 p-6 text-red-300">Board not found.</div>;

  return (
    <>
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
          {board?.lists?.map((list) => (
            <List
              key={list._id}
              list={list}
              onAddCard={handleAddCard}
              onCardClick={setSelectedCard}
              onCardDragStart={handleCardDragStart}
              onCardDrop={handleCardDrop}
            />
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
      {selectedCard && (
        <EditCardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onSaved={() => mutateBoard()}
        />
      )}
    </>
  );
};

export default BoardPage;
