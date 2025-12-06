// src/pages/editor/components/SortableStepItem.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

import StepForm from "@/pages/editor/components/StepForm";

export function SortableStepItem({ step, id, index, onChange, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none", // Prevent scrolling on drag
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-[#1e1e1e] border border-[#333] rounded-md shadow-sm mb-4 p-5 border-l-[3px] border-l-pink-500 relative"
    >
      <div className="flex justify-between mb-2.5">
        <strong className="text-pink-500">Step {index + 1}</strong>
        <button
          className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
          onClick={onRemove}
        >
          Elimina Step
        </button>
      </div>
      <div
        className="absolute top-2 left-2 cursor-grab text-gray-500"
        {...listeners}
      >
        ⠿
      </div>
      <StepForm step={step} onChange={onChange} />
    </div>
  );
}
