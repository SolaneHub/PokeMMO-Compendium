import React, { useState } from "react";

import { usePokedexContext } from "@/context/PokedexContext";
import { StrategyStep, StrategyVariation } from "@/types/strategy";
import { generateId } from "@/utils/idUtils";

import { SortableNestedStepItem } from "./SortableNestedStepItem";

const createNewNestedStepTemplate = (): StrategyStep => ({
  type: "main",
  player: "",
  warning: "",
  variations: [],
  id: generateId("nested-step"),
});

interface VariationFormProps {
  variation: StrategyVariation;
  onChange: (updatedVariation: StrategyVariation) => void;
  onRemove: () => void;
}

const VariationForm = ({
  variation,
  onChange,
  onRemove,
}: VariationFormProps) => {
  usePokedexContext();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFieldChange = (
    field: keyof StrategyVariation,
    value: string | StrategyStep[] | undefined
  ) => {
    onChange({ ...variation, [field]: value });
  };

  const updateNestedSteps = (newSteps: StrategyStep[]) => {
    onChange({ ...variation, steps: newSteps });
  };

  const currentNestedSteps = variation.steps || [];

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentNestedSteps.length) return;

    const newSteps = [...currentNestedSteps];
    const [movedStep] = newSteps.splice(index, 1);
    if (movedStep) {
      newSteps.splice(targetIndex, 0, movedStep);
      updateNestedSteps(newSteps);
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

    const newSteps = [...currentNestedSteps];
    const [movedStep] = newSteps.splice(draggedIndex, 1);
    if (movedStep) {
      newSteps.splice(targetIndex, 0, movedStep);
      updateNestedSteps(newSteps);
    }
    setDraggedIndex(null);
  };

  const addStep = () => {
    updateNestedSteps([...currentNestedSteps, createNewNestedStepTemplate()]);
  };

  const removeStep = (idToRemove: string) => {
    const newSteps = currentNestedSteps.filter(
      (step: StrategyStep) => step.id !== idToRemove
    );
    updateNestedSteps(newSteps);
  };

  return (
    <div className="relative my-4 rounded-xl border border-l-[5px] border-white/5 border-l-purple-500 bg-[#1a1b20] p-5 text-white shadow-lg">
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
            onChange={(e) => handleFieldChange("type", e.target.value || "")}
            className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-sm font-bold text-white transition-all outline-none focus:border-purple-500"
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
            className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 text-sm font-bold text-white transition-all outline-none focus:border-purple-500"
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
          <div className="space-y-3">
            {currentNestedSteps.map((step: StrategyStep, i: number) => (
              <SortableNestedStepItem
                key={step.id}
                id={step.id}
                index={i}
                step={step}
                isFirst={i === 0}
                isLast={i === currentNestedSteps.length - 1}
                onMoveUp={() => moveItem(i, "up")}
                onMoveDown={() => moveItem(i, "down")}
                draggable
                onDragStart={(e) => handleDragStart(i, e)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(i, e)}
                onChange={(updated: StrategyStep) => {
                  const newSteps = [...currentNestedSteps];
                  newSteps[i] = updated;
                  updateNestedSteps(newSteps);
                }}
                onRemove={() => removeStep(step.id)}
              />
            ))}
          </div>
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
