import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import StepForm from "@/pages/editor/components/StepForm";

export function SortableNestedStepItem({
  step,
  id,
  index,
  onChange,
  onRemove,
}) {
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
      className="relative mb-4 rounded-md border border-l-[3px] border-[#333] border-l-orange-500 bg-[#1e1e1e] p-5 shadow-sm"
    >
      <div className="mb-2.5 flex justify-between">
        <strong className="text-orange-500">Nested Step {index + 1}</strong>
        <button
          className="cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
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
