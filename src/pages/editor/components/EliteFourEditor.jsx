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
import { useState } from "react";

import EliteFourMemberCard from "@/pages/editor/components/EliteFourMemberCard";
import EliteFourTeamOverview from "@/pages/editor/components/EliteFourTeamOverview";
import { SortableStepItem } from "@/pages/editor/components/SortableStepItem";

const createNewStepTemplate = () => ({
  type: "main",
  player: "",
  warning: "",
  variations: [],
  id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
});

const EliteFourEditor = ({ data, onChange }) => {
  const [memberIndex, setMemberIndex] = useState(null);
  const [teamKey, setTeamKey] = useState(null);
  const [pokemon, setPokemon] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!data || !Array.isArray(data)) {
    return (
      <div className="p-5 text-center text-[#ff6b81]">
        ⚠️ Invalid Elite Four Data. Expected an array.
      </div>
    );
  }

  const currentMember = memberIndex !== null ? data?.[memberIndex] : null;
  const currentTeam = currentMember?.teams?.[teamKey];
  const steps = currentTeam?.pokemonStrategies?.[pokemon];

  const updateStrategies = (newStrategies) => {
    const newData = JSON.parse(JSON.stringify(data));
    if (newData[memberIndex]?.teams?.[teamKey]?.pokemonStrategies) {
      newData[memberIndex].teams[teamKey].pokemonStrategies[pokemon] =
        newStrategies;
      onChange(newData);
    }
  };

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      const newSteps = arrayMove(steps, oldIndex, newIndex);
      updateStrategies(newSteps);
    }
  }

  return (
    <div>
      <title>Editor: Elite Four</title>
      <h3 className="mb-5 border-b-2 border-blue-500 pb-2.5 text-lg font-semibold text-white">
        🏰 E4 Editor
      </h3>

      {/* Elite Four Member Selection */}
      <div className="mb-8">
        <h4 className="text-md mb-3 font-semibold text-white">
          Select Member:
        </h4>
        <div className="flex flex-wrap gap-4">
          {Array.isArray(data) &&
            data.map((member, i) => (
              <EliteFourMemberCard
                key={i}
                member={member}
                isSelected={memberIndex === i}
                onSelect={() => {
                  setMemberIndex(i);
                  setTeamKey(null);
                  setPokemon(null);
                }}
              />
            ))}
        </div>
      </div>

      {/* Team Selection for Selected Member */}
      {currentMember && (
        <div className="mb-8 animate-[fade-in_0.3s_ease-out]">
          <h4 className="text-md mb-3 font-semibold text-white">
            Select Team for {currentMember.name}:
          </h4>
          <div className="flex flex-wrap gap-4">
            {Object.keys(currentMember.teams).map((key) => (
              <button
                key={key}
                className={`min-w-[150px] flex-1 rounded-lg border-2 p-3 text-center transition-all duration-200 ease-in-out ${teamKey === key ? "border-blue-500 bg-blue-900/30 shadow-lg" : "border-gray-700 bg-gray-800 hover:border-blue-500 hover:bg-gray-700"} focus:ring-opacity-50 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                onClick={() => {
                  setTeamKey(key);
                  setPokemon(null);
                }}
              >
                <span
                  className={`text-lg font-semibold ${teamKey === key ? "text-blue-300" : "text-white"}`}
                >
                  {key}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pokémon Selection for Selected Team */}
      {currentTeam && (
        <div className="mb-8 animate-[fade-in_0.3s_ease-out]">
          <EliteFourTeamOverview
            teamKey={teamKey}
            team={currentTeam}
            selectedPokemon={pokemon}
            onSelectPokemon={setPokemon}
          />
        </div>
      )}

      {steps && pokemon ? (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <div className="my-5 flex items-center justify-between border-b border-[#444] pb-2.5">
            <h4 className="m-0 font-bold text-blue-500">
              Strategy for: <span className="text-white">{pokemon}</span>
            </h4>
            <button
              className="cursor-pointer rounded border-none bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 active:translate-y-[1px]"
              onClick={() =>
                updateStrategies([...steps, createNewStepTemplate()])
              }
            >
              + Add Step
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={steps.map((s) => s.id)}>
              {steps.map((step, i) => (
                <SortableStepItem
                  key={step.id}
                  id={step.id}
                  index={i}
                  step={step}
                  onChange={(updatedStep) => {
                    const newSteps = [...steps];
                    newSteps[i] = updatedStep;
                    updateStrategies(newSteps);
                  }}
                  onRemove={() =>
                    updateStrategies(steps.filter((_, idx) => idx !== i))
                  }
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      ) : pokemon ? (
        <div className="mt-5 rounded-lg border-2 border-dashed border-[#444] p-10 text-center text-[#888]">
          No steps configured for this Pokémon.
          <button
            className="mt-4 cursor-pointer rounded border-none bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 active:translate-y-[1px]"
            onClick={() => updateStrategies([createNewStepTemplate()])}
          >
            + Add First Step
          </button>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border-2 border-dashed border-[#444] p-10 text-center text-[#888]">
          Select a Member, a Team, and a Pokémon to edit strategy.
        </div>
      )}
    </div>
  );
};

export default EliteFourEditor;
