import React, { useState } from "react";
import { type Card } from "../api/cards.js";

type ListProps = {
  list: { _id: string; name: string; cards: Card[] };
  onAddCard: (listId: string, text: string) => void;
  onCardClick: (card: Card) => void;
  onCardDragStart: (cardId: string, fromListId: string) => void;
  onCardDrop: (toListId: string, toIndex: number) => void;
};

const DropSlot = ({
  active,
  onDragOver,
  onDrop,
}: {
  active: boolean;
  onDragOver: () => void;
  onDrop: (e: React.DragEvent) => void;
}) => (
  <div
    className={`transition-all rounded ${active ? "h-8 bg-blue-200 border-2 border-dashed border-blue-400 my-0.5" : "h-1"
      }`}
    onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
    onDrop={onDrop}
  />
);

const List = ({ list, onAddCard, onCardClick, onCardDragStart, onCardDrop }: ListProps) => {
  const [addingCard, setAddingCard] = useState(false);
  const [cardText, setCardText] = useState("");
  const [isHovering, setIsHovering] = useState(-1);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const handleAddCard = () => {
    if (cardText.trim()) {
      onAddCard(list._id, cardText.trim());
      setCardText("");
      setAddingCard(false);
    }
  };

  const handleSlotDrop = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDragOverSlot(null);
    onCardDrop(list._id, index);
  };

  return (
    <div
      className={`rounded-xl w-64 shrink-0 p-3 flex flex-col gap-2 max-h-full transition-colors ${dragOverSlot !== null ? "bg-blue-100 ring-2 ring-blue-300" : "bg-gray-100"
        }`}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverSlot(null);
      }}
      onDrop={(e) => {
        e.preventDefault();
        // Fallback: only fires if no slot captured it (e.g. empty list or dropped on header)
        if (dragOverSlot === null) onCardDrop(list._id, list.cards.length);
        setDragOverSlot(null);
      }}
    >
      <h2 className="font-semibold text-sm text-gray-800 px-1">{list.name}</h2>

      <div className="flex flex-col overflow-y-auto px-1">
        <DropSlot
          active={dragOverSlot === 0}
          onDragOver={() => setDragOverSlot(0)}
          onDrop={(e) => handleSlotDrop(e, 0)}
        />

        {list.cards.map((card, idx) => (
          <React.Fragment key={card._id}>
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                onCardDragStart(card._id, list._id);
              }}
              onClick={() => onCardClick(card)}
              onMouseEnter={() => setIsHovering(idx)}
              onMouseLeave={() => setIsHovering(-1)}
              className="bg-white rounded-lg shadow-sm px-3 py-2 text-sm text-gray-700 cursor-grab active:cursor-grabbing hover:outline-2 hover:outline-blue-500 hover:outline-double transition-colors"
            >
              {card.labels && card.labels.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-1">
                  {card.labels.map((l, index) => (
                    (isHovering !== idx) ?
                      <span
                        key={l.value}
                        className={`inline-block h-2 w-8 rounded-full ${(l as any).colourClass ?? `bg-${l}-500`} opacity-80`}
                      />

                      :
                      <span
                        key={l.value}
                        className={`inline-block px-2 transition-all min-h-2 min-w-8 rounded-full ${l.colourClass ?? ""} ${l.textColor ?? ""} opacity-80`}
                      >
                        {l.text}
                      </span>
                  ))}
                </div>
              )}
              <p className="text-gray-800">{card.title}</p>
              {card.dueDate && (
                new Date(card.dueDate) < new Date() ?
                  <p className="text-xs bg-red-500 opacity-70 text-white mt-1 py-1 px-2 rounded">
                    ⏰ {new Date(card.dueDate).toLocaleDateString()}
                  </p>
                  :
                  <p className="text-xs text-gray-500 mt-1">
                    📅 {new Date(card.dueDate).toLocaleDateString()}
                  </p>
              )}
              {card.checklist && card.checklist.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  ✓ {card.checklist.filter((i) => i.done).length}/{card.checklist.length}
                </p>
              )}
            </div>

            <DropSlot
              active={dragOverSlot === idx + 1}
              onDragOver={() => setDragOverSlot(idx + 1)}
              onDrop={(e) => handleSlotDrop(e, idx + 1)}
            />
          </React.Fragment>
        ))}
      </div>

      {addingCard ? (
        <div className="flex flex-col gap-2 mt-1">
          <textarea
            autoFocus
            className="w-full rounded-lg border border-blue-400 px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none"
            rows={2}
            placeholder="Enter card title..."
            value={cardText}
            onChange={(e) => setCardText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddCard();
              }
              if (e.key === "Escape") setAddingCard(false);
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCard}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg"
            >
              Add card
            </button>
            <button
              onClick={() => {
                setAddingCard(false);
                setCardText("");
              }}
              className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingCard(true)}
          className="text-left text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg px-2 py-1 mt-1"
        >
          + Add a card
        </button>
      )}
    </div>
  );
};

export default List;

