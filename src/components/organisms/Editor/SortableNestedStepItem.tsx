import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { StrategyStep } from "@/firebase/firestoreService";

import StepForm from "./StepForm";

interface SortableNestedStepItemProps {
  step: StrategyStep;
  id: string;
  index: number;
  onChange: (updatedStep: StrategyStep) => void;
  onRemove: () => void;
}

export function SortableNestedStepItem({
  step,
  id,
  index,
  onChange,
  onRemove,
}: SortableNestedStepItemProps) {
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
    touchAction: "none",
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative overflow-hidden rounded-xl border border-l-[5px] border-white/5 border-l-purple-500 bg-[#0f1014]/40 p-6 text-white shadow-lg transition-shadow hover:shadow-purple-900/5"
    >
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="cursor-grab text-slate-600 transition-colors hover:text-purple-400 active:cursor-grabbing"
            aria-label={`Drag to reorder nested step ${index + 1}`}
            {...listeners}
            {...attributes}
          >
            <GripVertical size={20} />
          </div>
          <h4 className="text-sm font-black tracking-widest text-purple-400 uppercase">
            Nested Step {index + 1}
          </h4>
        </div>
        <button
          type="button"
          className="rounded-lg border border-red-600/20 bg-red-600/10 px-3 py-1.5 text-xs font-bold text-red-400 transition-all hover:bg-red-600 hover:text-white"
          onClick={onRemove}
        >
          Remove Nested
        </button>
      </div>
      <StepForm step={step} onChange={onChange} />
    </div>
  );
}
