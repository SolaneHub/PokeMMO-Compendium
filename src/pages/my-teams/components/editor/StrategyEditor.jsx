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

const EXAMPLE_STEP = {
  type: "main",
  player:
    "Use Stealth Rock; facing Claydol, [SWITCH] switch to Chandelure, use 3x Calm Mind, give X Speed",
  variations: [
    {
      type: "step",
      name: "[SWITCH] Lapras",
      steps: [
        {
          type: "main",
          player:
            "[SWITCH] switch to Blissey, [BAIT] baiting Lucario, use Trick, [SWITCH] switch to Chandelure, use 3x Calm Mind, give X Speed",
        },
      ],
    },
  ],
};

const addIdsToStep = (step, parentId = "root") => {
  const newStep = {
    ...step,
    id: step.id || crypto.randomUUID(), // Ensure ID is present
  };

  if (newStep.variations && newStep.variations.length > 0) {
    newStep.variations = newStep.variations.map((v) => ({
      ...v,
      steps: v.steps
        ? v.steps.map((nestedStep) => addIdsToStep(nestedStep, newStep.id))
        : [],
    }));
  }
  return newStep;
};

const createNewStepTemplate = () => ({
  type: "main",
  player: "",
  warning: "",
  variations: [],
  id: crypto.randomUUID(),
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
      <div className="animate-fade-in flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-white/5 bg-[#0a0b0e]/50 p-6 text-slate-500">
        <Sword size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium">
          Select an Enemy Pokémon to plan a strategy.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex min-h-[600px] flex-col rounded-xl border border-white/5 bg-[#111216] p-6 shadow-sm">
      <div className="flex flex-1 animate-[fade-in_0.3s_ease-out] flex-col">
        <div className="mb-6 flex items-center justify-between border-b-2 border-blue-600 pb-2.5">
          <div>
            <h2 className="text-xl font-bold text-slate-200">
              Strategy vs{" "}
              <span className="text-blue-400">{selectedEnemyPokemon}</span>
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {selectedRegion} • {selectedMember?.name}
            </p>
          </div>
          <button
            className="cursor-pointer rounded border-none bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 active:translate-y-[1px]"
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
                <div className="mt-8 border-t border-white/5 pt-4">
                  <p className="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Examples
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSteps([...steps, addIdsToStep(EXAMPLE_STEP)])
                    }
                    className="text-xs text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                  >
                    + Append Example Step (Articuno vs Lorelei)
                  </button>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="animate-fade-in flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/5 bg-[#0a0b0e]/50 p-10">
            <p className="mb-4 max-w-md text-center text-slate-400">
              How do you handle{" "}
              <span className="text-blue-400">{selectedEnemyPokemon}</span>?{" "}
              <br />
              Click below to define your strategy step-by-step.
            </p>
            <div className="flex gap-4">
              <button
                className="cursor-pointer rounded border-none bg-white/5 px-4 py-2 text-sm font-medium text-blue-400 transition-all hover:bg-white/10 hover:text-blue-300"
                onClick={() => onUpdateSteps([createNewStepTemplate()])}
              >
                Create first step
              </button>

              <button
                className="cursor-pointer rounded border-none bg-white/5 px-4 py-2 text-sm font-medium text-blue-400 transition-all hover:bg-white/10 hover:text-blue-300"
                onClick={() => onUpdateSteps([addIdsToStep(EXAMPLE_STEP)])}
              >
                Load Example
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default StrategyEditor;
