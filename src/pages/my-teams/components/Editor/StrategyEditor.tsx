import { Plus, Sword } from "lucide-react";
import React, { useState } from "react";

import Button from "@/components/ui/Button";
import { StrategyStep } from "@/pages/my-teams/types/teams";

import { SortableStepItem } from "./SortableStepItem";

const createNewStepTemplate = (): StrategyStep => ({
  type: "main",
  player: "",
  warning: "",
  variations: [],
  id: crypto.randomUUID(),
});

interface StrategyEditorProps {
  selectedEnemyPokemon: string | null;
  steps: StrategyStep[];
  onUpdateSteps: (newSteps: StrategyStep[]) => void;
}

const StrategyEditor = ({
  selectedEnemyPokemon,
  steps,
  onUpdateSteps,
}: StrategyEditorProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(index, 1);
    if (movedStep) {
      newSteps.splice(targetIndex, 0, movedStep);
      onUpdateSteps(newSteps);
    }
  };

  const handleDragStart = (
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    targetIndex: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(draggedIndex, 1);
    if (movedStep) {
      newSteps.splice(targetIndex, 0, movedStep);
      onUpdateSteps(newSteps);
    }
    setDraggedIndex(null);
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
    <div className="animate-fade-in flex h-full flex-col text-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Vs. <span className="text-blue-400">{selectedEnemyPokemon}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Define your turn-by-turn strategy.
          </p>
        </div>
        <Button onClick={addStep} variant="primary" size="sm" icon={Plus}>
          Add Step
        </Button>
      </div>

      <div className="flex-1 space-y-4">
        {steps && steps.length > 0 ? (
          <div className="space-y-4 pb-20">
            {steps.map((step, i) => (
              <SortableStepItem
                key={step.id}
                id={step.id}
                index={i}
                step={step}
                isFirst={i === 0}
                isLast={i === steps.length - 1}
                onMoveUp={() => moveItem(i, "up")}
                onMoveDown={() => moveItem(i, "down")}
                draggable
                onDragStart={(e) => handleDragStart(i, e)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(i, e)}
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
            {/* Bottom Add Button */}
            <Button
              onClick={addStep}
              variant="ghost"
              size="lg"
              fullWidth
              className="border-dashed border-white/10 py-4 text-slate-500 hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-blue-400"
              icon={Plus}
            >
              Add Next Step
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#1a1b20]/50 py-16 text-center">
            <p className="mb-4 max-w-sm text-sm text-slate-400">
              No plan defined for{" "}
              <span className="text-blue-400">{selectedEnemyPokemon}</span> yet.
            </p>
            <Button onClick={addStep} variant="secondary" size="lg" icon={Plus}>
              Create First Step
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyEditor;
