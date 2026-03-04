import { useState } from "react";

type Card = { id: string; text: string };

type ListProps = {
  list: { _id: string; name: string; cards: Card[] };
  onAddCard: (listId: string, text: string) => void;
};

const List = ({ list, onAddCard }: ListProps) => {
  const [addingCard, setAddingCard] = useState(false);
  const [cardText, setCardText] = useState("");

  const handleAddCard = () => {
    if (cardText.trim()) {
      onAddCard(list._id, cardText.trim());
      setCardText("");
      setAddingCard(false);
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl w-64 shrink-0 p-3 flex flex-col gap-2 max-h-full">
      <h2 className="font-semibold text-sm text-gray-800 px-1">{list.name}</h2>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {list.cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-sm px-3 py-2 text-sm text-gray-700"
          >
            {card.text}
          </div>
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
