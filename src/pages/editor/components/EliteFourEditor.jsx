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
import { SortableStepItem } from "@/pages/editor/components/SortableStepItem"; // Import SortableStepItem

const createNewStepTemplate = () => ({
  type: "main",
  player: "",
  warning: "",
  variations: [],
  id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID on creation
});

const EliteFourEditor = ({ data, onChange }) => {
  const [memberIndex, setMemberIndex] = useState(null);
  const [teamKey, setTeamKey] = useState(null);
  const [pokemon, setPokemon] = useState(null);
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      <h3 className="border-b-2 border-pink-500 pb-2.5 mb-5 text-lg font-semibold text-white">
        🏰 Editor E4
      </h3>

      {/* Elite Four Member Selection */}
      <div className="mb-8">
        <h4 className="text-white text-md font-semibold mb-3">
          Seleziona Membro:
        </h4>
        <div className="flex flex-wrap gap-4">
          {data?.map((member, i) => (
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
          <h4 className="text-white text-md font-semibold mb-3">
            Seleziona Team di {currentMember.name}:
          </h4>
          <div className="flex flex-wrap gap-4">
            {Object.keys(currentMember.teams).map((key) => (
              <button
                key={key}
                className={`flex-1 min-w-[150px] p-3 rounded-lg border-2 text-center transition-all duration-200 ease-in-out
                    ${teamKey === key ? "border-pink-500 bg-pink-900/30 shadow-lg" : "border-gray-700 bg-gray-800 hover:border-pink-500 hover:bg-gray-700"}
                    focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50`}
                onClick={() => {
                  setTeamKey(key);
                  setPokemon(null);
                }}
              >
                <span
                  className={`text-lg font-semibold ${teamKey === key ? "text-pink-300" : "text-white"}`}
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
          <div className="flex justify-between items-center my-5 border-b border-[#444] pb-2.5">
            <h4 className="m-0 text-pink-500 font-bold">
              Strategia per: <span className="text-white">{pokemon}</span>
            </h4>
            <button
              className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-4 py-2 text-sm font-medium cursor-pointer transition-all active:translate-y-[1px]"
              onClick={() =>
                updateStrategies([...steps, createNewStepTemplate()])
              }
            >
              + Aggiungi Step
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
                  key={step.id} // Use the unique ID as key
                  id={step.id} // Pass the ID to SortableStepItem
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
        <div className="text-center p-10 border-2 border-dashed border-[#444] rounded-lg mt-5 text-[#888]">
          Nessuno step configurato per questo Pokémon.
          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white border-none rounded px-4 py-2 text-sm font-medium cursor-pointer transition-all active:translate-y-[1px]"
            onClick={() => updateStrategies([createNewStepTemplate()])}
          >
            + Aggiungi Primo Step
          </button>
        </div>
      ) : (
        <div className="text-center p-10 border-2 border-dashed border-[#444] rounded-lg mt-5 text-[#888]">
          Seleziona un Membro, un Team e un Pokémon per modificare la strategia.
        </div>
      )}
    </div>
  );
};

export default EliteFourEditor;
