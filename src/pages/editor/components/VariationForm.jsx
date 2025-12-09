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
  type: "",
  player: "",
  id: `nested-step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
});

const VariationForm = ({ variation, onChange }) => {
  const { pokemonNames, moveNames, itemNames } = usePokedexData();

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

  const combinedSuggestions = [
    ...new Set([...pokemonNames, ...moveNames, ...itemNames]),
  ].sort();

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
    <div className="relative my-4 rounded-r-md border-l-[3px] border-pink-500 bg-[#252526] p-4">
      <h4 className="mt-0 mb-2.5 text-sm font-semibold tracking-wide text-pink-500 uppercase">
        Variation Details
      </h4>

      <label className="mt-4 block text-xs font-bold text-[#b0b0b0]">
        Type:
        <select
          value={variation.type || ""}
          onChange={(e) => handleFieldChange("type", e.target.value)}
          className="mt-1.5 w-full rounded border border-[#444] bg-[#2c2c2c] px-3 py-2 text-[0.95rem] text-white transition-all focus:border-blue-500 focus:bg-[#333] focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
        >
          <option value="">-- Select Type --</option>
          <option value="step">Step</option>
          <option value="item">Item</option>
          <option value="move">Move</option>
          <option value="ability">Ability</option>
          <option value="status">Status</option>
          <option value="check">Check</option>
          <option value="condition">Condition</option>
        </select>
      </label>

      <label className="mt-4 block text-xs font-bold text-[#b0b0b0]">
        Name / Trigger:
        <input
          type="text"
          list="variation-suggestions"
          value={variation.name || ""}
          placeholder="e.g. Leftovers, Earthquake..."
          onChange={(e) => handleFieldChange("name", e.target.value)}
          className="mt-1.5 w-full rounded border border-[#444] bg-[#2c2c2c] px-3 py-2 text-[0.95rem] text-white transition-all focus:border-blue-500 focus:bg-[#333] focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
        />
        <datalist id="variation-suggestions">
          {combinedSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      </label>

      <div className="mt-4">
        <h5 className="mb-2.5 font-semibold text-white">Nested Steps:</h5>
        {currentNestedSteps.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={currentNestedSteps.map((s) => s.id)}>
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
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-[#888] italic">
            Nessuno step annidato configurato.
          </p>
        )}

        <div className="mt-2.5 flex justify-end gap-2.5">
          <button
            className="flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 active:translate-y-[1px]"
            onClick={addStep}
          >
            ➕ Add Nested Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariationForm;
