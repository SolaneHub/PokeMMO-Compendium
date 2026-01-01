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
import { Plus, Sword } from "lucide-react";

import { SortableStepItem } from "./SortableStepItem";

const createNewStepTemplate = () => ({
  type: "main",
  player: "",
  warning: "",
  variations: [],
  id: crypto.randomUUID(),
});

const StrategyEditor = ({
  selectedEnemyPokemon,
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

  const addStep = () => {
    onUpdateSteps([...(steps || []), createNewStepTemplate()]);
  };

  if (!selectedEnemyPokemon) {
    return (
      <div className="animate-fade-in flex h-full flex-col items-center justify-center p-8 text-slate-500">
        <div className="rounded-full bg-white/5 p-4">
          <Sword size={32} className="opacity-50" />
        </div>
        <p className="mt-4 text-sm font-medium">
          Select an Enemy Pokémon from the sidebar to start planning.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-200">
            Vs. <span className="text-blue-400">{selectedEnemyPokemon}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Define your turn-by-turn strategy.
          </p>
        </div>
        <button
          onClick={addStep}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-500 active:translate-y-[1px]"
        >
          <Plus size={16} />
          Add Step
        </button>
      </div>

      <div className="flex-1 space-y-4">
        {steps && steps.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={steps.map((s) => s.id)}>
              <div className="space-y-4 pb-20">
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
                
                {/* Bottom Add Button for convenience when list is long */}
                <button
                  onClick={addStep}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-4 text-sm font-medium text-slate-500 transition-colors hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-blue-400"
                >
                  <Plus size={16} />
                  Add Next Step
                </button>
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#1a1b20]/50 py-16 text-center">
            <p className="mb-4 max-w-sm text-sm text-slate-400">
              No plan defined for <span className="text-blue-400">{selectedEnemyPokemon}</span> yet.
            </p>
            <button
              onClick={addStep}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/5 px-6 py-3 text-sm font-bold text-slate-200 transition-all hover:bg-white/10 hover:text-white"
            >
              <Plus size={16} />
              Create First Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default StrategyEditor;
