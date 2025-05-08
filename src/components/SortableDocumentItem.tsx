import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableDocumentItemProps } from "../interfaces/SortableDocumentItemProps";
import TrashCanIcon from "../icons/TrashCanIcon";
import DragHandleIcon from "../icons/DragHandleIcon";

export function SortableDocumentItem({
  id,
  idx,
  selectedIdx,
  handleSelectDoc,
  handleRemoveDoc,
  doc,
}: SortableDocumentItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
    background: isDragging ? "#e0e7ef" : undefined,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center justify-between p-2 rounded mb-1 transition-colors
        ${
          idx === selectedIdx
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "hover:bg-gray-200 text-gray-500"
        }
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
      `}
    >
      <span
        className="mr-2 flex items-center cursor-grab active:cursor-grabbing"
        {...listeners}
      >
        <DragHandleIcon className="w-5 h-5 text-gray-600" />
      </span>
      <span
        onClick={() => handleSelectDoc(idx)}
        className="flex-1 truncate select-none"
      >
        {doc.name}
      </span>
      <button
        className="ml-2 p-1 rounded hover:bg-red-100 hover:text-red-600 group"
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveDoc(idx);
        }}
        aria-label="Remove document"
      >
        <TrashCanIcon className="h-4 w-4" />
      </button>
    </li>
  );
}
