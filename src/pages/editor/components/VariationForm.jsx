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

    if (active.id !== over.id) {
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
    <div className="bg-[#252526] border-l-[3px] border-pink-500 rounded-r-md my-4 p-4 relative">
      <h4 className="text-pink-500 mt-0 text-sm uppercase tracking-wide font-semibold mb-2.5">
        Variation Details
      </h4>

      <label className="text-[#b0b0b0] text-xs font-bold mt-4 block">
        Type:
        <select
          value={variation.type || ""}
          onChange={(e) => handleFieldChange("type", e.target.value)}
          className="bg-[#2c2c2c] border border-[#444] rounded text-white text-[0.95rem] px-3 py-2 w-full mt-1.5 transition-all focus:bg-[#333] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
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

      <label className="text-[#b0b0b0] text-xs font-bold mt-4 block">
        Name / Trigger:
        <input
          type="text"
          list="variation-suggestions"
          value={variation.name || ""}
          placeholder="e.g. Leftovers, Earthquake..."
          onChange={(e) => handleFieldChange("name", e.target.value)}
          className="bg-[#2c2c2c] border border-[#444] rounded text-white text-[0.95rem] px-3 py-2 w-full mt-1.5 transition-all focus:bg-[#333] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
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

        <div className="flex justify-end gap-2.5 mt-2.5">
          <button
            className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-4 py-2.5 text-sm font-medium cursor-pointer flex items-center justify-center gap-2 transition-all active:translate-y-[1px]"
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
