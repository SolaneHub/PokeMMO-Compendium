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
import { Sword } from "lucide-react";

import { SortableStepItem } from "@/pages/editor/components/SortableStepItem";

const createNewStepTemplate = () => ({
  type: "main",
  player: "",
  warning: "",
  variations: [],
  id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
});

const StrategyEditor = ({
  selectedEnemyPokemon,
  selectedMember,
  selectedRegion,
  steps,
  onUpdateSteps,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      onUpdateSteps(arrayMove(steps, oldIndex, newIndex));
    }
  };

  if (!selectedEnemyPokemon) {
    return (
      <div className="flex min-h-[600px] flex-col rounded-xl border border-slate-700 bg-slate-800 p-6">
        <div className="flex flex-1 flex-col items-center justify-center text-slate-500 opacity-60">
          <Sword size={64} className="mb-4" />
          <p className="text-xl font-medium">
            Select an Enemy Pokémon to plan a strategy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[600px] flex-col rounded-xl border border-slate-700 bg-slate-800 p-6">
      <div className="animate-fade-in flex flex-1 flex-col">
        <div className="mb-6 flex items-center justify-between border-b border-slate-600 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Strategy vs {selectedEnemyPokemon}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {selectedRegion} • {selectedMember?.name}
            </p>
          </div>
          <button
            className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white shadow-lg transition-colors hover:bg-green-700 active:scale-95"
            onClick={() =>
              onUpdateSteps([...(steps || []), createNewStepTemplate()])
            }
          >
            + Add Step
          </button>
        </div>

        {steps && steps.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={steps.map((s) => s.id)}>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <SortableStepItem
                    key={step.id}
                    id={step.id}
                    index={i}
                    step={step}
                    onChange={(updatedStep) => {
                      const newSteps = [...steps];
                      newSteps[i] = updatedStep;
                      onUpdateSteps(newSteps);
                    }}
                    onRemove={() =>
                      onUpdateSteps(steps.filter((_, idx) => idx !== i))
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/30 p-10">
            <p className="mb-4 max-w-md text-center text-slate-500">
              How do you handle {selectedEnemyPokemon}? <br />
              Click below to define your strategy step-by-step.
            </p>
            <button
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 font-medium text-pink-400 transition-colors hover:border-pink-500 hover:underline"
              onClick={() => onUpdateSteps([createNewStepTemplate()])}
            >
              Create first step
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default StrategyEditor;
