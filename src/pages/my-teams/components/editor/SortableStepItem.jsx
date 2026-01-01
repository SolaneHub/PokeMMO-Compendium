import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import StepForm from "./StepForm";

export function SortableStepItem({ step, id, index, onChange, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative overflow-hidden rounded-xl border border-l-[5px] border-white/5 border-l-blue-500 bg-[#1a1b20] p-6 shadow-lg transition-shadow hover:shadow-blue-900/5"
    >
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="cursor-grab text-slate-600 transition-colors hover:text-blue-400 active:cursor-grabbing"
            aria-label="Drag to reorder step"
            {...listeners}
          >
            <GripVertical size={20} />
          </div>
          <h4 className="text-sm font-black tracking-widest text-blue-400 uppercase">
            Step {index + 1}
          </h4>
        </div>
        <button
          className="rounded-lg border border-red-600/20 bg-red-600/10 px-3 py-1.5 text-xs font-bold text-red-400 transition-all hover:bg-red-600 hover:text-white"
          aria-label={`Remove step ${index + 1}`}
          onClick={onRemove}
        >
          Remove Step
        </button>
      </div>
      <StepForm step={step} onChange={onChange} />
    </div>
  );
}
