import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { SortableNestedStepItem } from "@/pages/editor/components/SortableNestedStepItem";
import { usePokedexData } from "@/shared/hooks/usePokedexData";

const createNewNestedStepTemplate = () => ({
  type: "main",
  player: "",
  warning: "",
  variations: [],
  id: `nested-step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
});

const VariationForm = ({ variation, onChange, onRemove }) => {
  usePokedexData();

  const handleFieldChange = (field, value) => {
    onChange({ ...variation, [field]: value });
  };

  const updateNestedSteps = (newSteps) => {
    onChange({ ...variation, steps: newSteps });
  };

  const addStep = () => {
    updateNestedSteps([
      ...(variation.steps || []),
      createNewNestedStepTemplate(),
    ]);
  };

  const removeStep = (idToRemove) => {
    const newSteps = (variation.steps || []).filter(
      (step) => step.id !== idToRemove
    );
    updateNestedSteps(newSteps);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = (variation.steps || []).findIndex(
        (step) => step.id === active.id
      );
      const newIndex = (variation.steps || []).findIndex(
        (step) => step.id === over.id
      );
      const newSteps = arrayMove(variation.steps || [], oldIndex, newIndex);
      updateNestedSteps(newSteps);
    }
  }

  const currentNestedSteps = variation.steps || [];

  return (
    <div className="relative my-4 rounded-xl border border-l-[5px] border-white/5 border-l-purple-500 bg-[#1a1b20] p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-2">
        <h4 className="m-0 text-xs font-black tracking-[0.2em] text-purple-400 uppercase">
          Variation Logic
        </h4>
        <button
          onClick={onRemove}
          className="text-slate-500 transition-colors hover:text-red-400"
        >
          Remove Variation
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Logic Type
          </span>
          <select
            value={variation.type || ""}
            onChange={(e) =>
              handleFieldChange("type", e.target.value || undefined)
            }
            className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-sm font-bold text-slate-100 transition-all outline-none focus:border-purple-500"
          >
            <option value="">Default (Undefined)</option>
            <option value="step">Step-based Variation</option>
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Trigger Name
          </span>
          <input
            type="text"
            value={variation.name || ""}
            placeholder="e.g. If Leftovers active..."
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-sm font-bold text-slate-100 transition-all outline-none focus:border-purple-500"
          />
        </label>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Execution Steps:
          </h5>
          <button
            type="button"
            className="text-[10px] font-black tracking-widest text-blue-400 uppercase transition-colors hover:text-blue-300"
            onClick={addStep}
          >
            + Add Sub-Step
          </button>
        </div>

        {currentNestedSteps.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={currentNestedSteps.map((s) => s.id)}>
              <div className="space-y-3">
                {currentNestedSteps.map((step, i) => (
                  <SortableNestedStepItem
                    key={step.id}
                    id={step.id}
                    index={i}
                    step={step}
                    onChange={(updated) => {
                      const newSteps = [...currentNestedSteps];
                      newSteps[i] = updated;
                      updateNestedSteps(newSteps);
                    }}
                    onRemove={() => removeStep(step.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-white/10 bg-black/10 py-8 text-center">
            <p className="text-xs font-medium text-slate-500 italic">
              No nested steps defined yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariationForm;
