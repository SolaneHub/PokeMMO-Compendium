import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";

import StepForm from "@/pages/editor/components/StepForm";

export function SortableNestedStepItem({
  step,
  id,
  index,
  onChange,
  onRemove,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative mb-4 rounded-md border border-l-[3px] border-[#333] border-l-orange-500 bg-[#1e1e1e] p-5 shadow-sm"
    >
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="cursor-grab p-1 text-gray-500 transition-colors hover:text-white"
            {...listeners}
            {...attributes}
            title="Drag to reorder"
          >
            <GripVertical size={20} />
          </button>
          <strong className="text-orange-500">Nested Step {index + 1}</strong>
        </div>
        <button
          className="flex cursor-pointer items-center gap-1 rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
          onClick={onRemove}
          title="Delete Step"
        >
          <Trash2 size={14} /> Delete Step
        </button>
      </div>
      <StepForm step={step} onChange={onChange} />
    </div>
  );
}
