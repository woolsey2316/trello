import React, { useState, useRef } from "react";
import { type Card, type ChecklistItem, updateCard, uploadAttachment } from "../api/cards.js";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const LABEL_COLORS = [
  { value: "green", bg: "bg-green-500", textColor: "text-white" },
  { value: "yellow", bg: "bg-yellow-400", textColor: "text-gray-800" },
  { value: "orange", bg: "bg-orange-500", textColor: "text-white" },
  { value: "red", bg: "bg-red-500", textColor: "text-white" },
  { value: "purple", bg: "bg-purple-500", textColor: "text-white" },
  { value: "blue", bg: "bg-blue-500", textColor: "text-white" },
  { value: "sky", bg: "bg-sky-400", textColor: "text-gray-800" },
];

interface EditCardModalProps {
  card: Card;
  onClose: () => void;
  onSaved: () => void;
}

interface Labels {
  value: string;
  colourClass: string;
  text?: string;
  textColor?: string;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ card, onClose, onSaved }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [labels, setLabels] = useState<Labels[]>(card.labels ?? []);
  const [isEditingLabelText, setIsEditingLabelText] = useState(-1);
  const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.slice(0, 10) : "");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(card.checklist ?? []);
  const [newCheckItem, setNewCheckItem] = useState("");
  const [assignedTo, setAssignedTo] = useState<string[]>(card.assignedTo ?? []);
  const [attachmentPath, setAttachmentPath] = useState(card.attachmentPath ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentUserId = localStorage.getItem("userId") ?? "";

  const toggleLabel = (color: string) =>
    setLabels((prev) =>
      prev.some((l) => l.value === color) ? prev.filter((l) => l.value !== color) : [...prev, {
        value: color, text: "", colourClass: LABEL_COLORS.find((c) => c.value === color)?.bg ?? "bg-gray-400",
        textColor: LABEL_COLORS.find((c) => c.value === color)?.textColor ?? "text-white"
      }]
    );

  const addCheckItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklist((prev) => [...prev, { text: newCheckItem.trim(), done: false }]);
    setNewCheckItem("");
  };

  const toggleCheckItem = (idx: number) =>
    setChecklist((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, done: !item.done } : item))
    );

  const removeCheckItem = (idx: number) =>
    setChecklist((prev) => prev.filter((_, i) => i !== idx));

  const toggleAssignMe = () =>
    setAssignedTo((prev) =>
      prev.includes(currentUserId)
        ? prev.filter((id) => id !== currentUserId)
        : [...prev, currentUserId]
    );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await uploadAttachment(card._id, file);
    if (result.attachmentPath) setAttachmentPath(result.attachmentPath);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateCard(card._id, {
      title,
      description,
      labels,
      ...(dueDate ? { dueDate } : {}),
      checklist,
      assignedTo,
    });
    setSaving(false);
    onSaved();
    onClose();
  };

  const completedCount = checklist.filter((i) => i.done).length;
  const checklistProgress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-10"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-100 rounded-xl w-full max-w-2xl mx-4 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <input
            className="text-lg font-bold bg-transparent border-b border-transparent hover:border-gray-400 focus:border-blue-500 focus:outline-none w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl shrink-0">✕</button>
        </div>

        {/* Description */}
        <Section title="Description">
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400"
            rows={3}
            placeholder="Add a description…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Section>

        {/* Labels */}
        <Section title="Labels">
          <div className="flex flex-wrap gap-2">
            {LABEL_COLORS.map(({ value, bg }) => (
              <button
                key={value}
                onClick={() => toggleLabel(value)}
                className={`h-8 w-14 rounded-md ${bg} transition-opacity ${labels.some((l) => l.value === value) ? "opacity-100 ring-2 ring-offset-1 ring-gray-600" : "opacity-40"
                  }`}
                title={value}
              />
            ))}
          </div>
          {labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {labels.map((l, index) => {
                const bg = LABEL_COLORS.find((c) => c.value === l.value)?.bg ?? "bg-gray-400";
                return isEditingLabelText === -1 || isEditingLabelText !== index ? <span onClick={() => setIsEditingLabelText(index)} key={l.value} className={`${bg} cursor-pointer ${l.textColor} text-xs px-2 py-0.5 rounded-full`}>{l.text}</span> :
                  <input
                    key={l.value}
                    value={l.text}
                    onChange={(e) => setLabels((prev) => prev.map((label) => label.value === l.value ? { ...label, text: e.target.value } : label))}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setIsEditingLabelText(-1);
                      if (e.key === "Escape") {
                        setIsEditingLabelText(-1);
                        setLabels((prev) => prev.map((label) => label.value === l.value ? { ...label, text: l.text ?? "" } : label));
                      }
                    }}
                    className={`${bg} ${l.textColor} text-xs px-2 py-0.5 rounded-full focus:outline-none`
                    }
                  />
              })}
            </div>
          )}
        </Section>

        {/* Due Date */}
        <Section title="Due Date">
          <input
            type="date"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {dueDate && (
            <button
              onClick={() => setDueDate("")}
              className="ml-2 text-xs text-gray-400 hover:text-red-500"
            >
              Remove
            </button>
          )}
        </Section>

        {/* Checklist */}
        <Section title={`Checklist${checklist.length > 0 ? ` (${completedCount}/${checklist.length})` : ""}`}>
          {checklist.length > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5 mb-2">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleCheckItem(idx)}
                  className="h-4 w-4 accent-blue-600"
                />
                <span className={`text-sm flex-1 ${item.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                  {item.text}
                </span>
                <button
                  onClick={() => removeCheckItem(idx)}
                  className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add an item…"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
              value={newCheckItem}
              onChange={(e) => setNewCheckItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCheckItem()}
            />
            <button
              onClick={addCheckItem}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg"
            >
              Add
            </button>
          </div>
        </Section>

        {/* Members */}
        <Section title="Members">
          {assignedTo.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {assignedTo.map((uid) => (
                <span key={uid} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {uid === currentUserId ? "You" : uid}
                </span>
              ))}
            </div>
          )}
          {currentUserId && (
            <button
              onClick={toggleAssignMe}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${assignedTo.includes(currentUserId)
                ? "bg-blue-100 border-blue-300 text-blue-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
                }`}
            >
              {assignedTo.includes(currentUserId) ? "Remove me" : "Assign to me"}
            </button>
          )}
        </Section>

        {/* Attachment */}
        <Section title="Attachment">
          {attachmentPath && (
            <div className="mb-2">
              <img
                src={`${API}${attachmentPath}`}
                alt="attachment"
                className="max-h-40 rounded-lg object-contain border border-gray-200"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <p className="text-xs text-gray-400 mt-1 truncate">{attachmentPath}</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-sm text-gray-700 px-3 py-1.5 rounded-lg disabled:opacity-50"
          >
            {uploading ? "Uploading…" : attachmentPath ? "Replace image" : "Upload image"}
          </button>
        </Section>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="flex flex-col gap-2">
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
    {children}
  </div>
);

export default EditCardModal;
