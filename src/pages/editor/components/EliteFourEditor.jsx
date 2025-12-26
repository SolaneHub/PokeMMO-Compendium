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
      <div className="rounded-2xl border border-red-600/20 bg-red-600/10 p-12 text-center font-bold text-red-400">
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
    <div className="flex animate-[fade-in_0.3s_ease-out] flex-col gap-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100 uppercase">
            Elite Four Editor
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500 italic">
            Configure strategies for E4 members across all regions.
          </p>
        </div>
      </div>

      {/* Elite Four Member Selection */}
      <section className="space-y-4">
        <h4 className="ml-1 text-xs font-black tracking-widest text-slate-500 uppercase">
          Select Member
        </h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
      </section>

      {/* Team Selection for Selected Member */}
      {currentMember && (
        <section className="animate-[fade-in_0.3s_ease-out] space-y-4">
          <h4 className="ml-1 text-xs font-black tracking-widest text-slate-500 uppercase">
            Teams for {currentMember.name}
          </h4>
          <div className="flex flex-wrap gap-3">
            {Object.keys(currentMember.teams).map((key) => (
              <button
                key={key}
                className={`min-w-[120px] rounded-xl border-2 p-4 text-center transition-all duration-200 ease-in-out ${
                  teamKey === key
                    ? "border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-900/20"
                    : "border-white/5 bg-[#1a1b20] text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-slate-100"
                } focus:ring-2 focus:ring-blue-500/50 focus:outline-none`}
                onClick={() => {
                  setTeamKey(key);
                  setPokemon(null);
                }}
              >
                <span className="text-sm font-black tracking-wider uppercase">
                  {key}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Pokémon Selection for Selected Team */}
      {currentTeam && (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <EliteFourTeamOverview
            teamKey={teamKey}
            team={currentTeam}
            selectedPokemon={pokemon}
            onSelectPokemon={setPokemon}
          />
        </div>
      )}

      {steps && pokemon ? (
        <div className="flex animate-[fade-in_0.3s_ease-out] flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h4 className="m-0 text-xl font-bold text-slate-100">
              Strategy vs{" "}
              <span className="font-black text-blue-400">{pokemon}</span>
            </h4>
            <button
              className="rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 active:scale-95"
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
                      updateStrategies(newSteps);
                    }}
                    onRemove={() =>
                      updateStrategies(steps.filter((_, idx) => idx !== i))
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : pokemon ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-[#1a1b20]/30 py-20">
          <p className="font-medium text-slate-500 italic">
            No steps configured for this Pokémon.
          </p>
          <button
            className="mt-4 rounded-xl bg-green-600 px-6 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
            onClick={() => updateStrategies([createNewStepTemplate()])}
          >
            + Create First Step
          </button>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-[#1a1b20]/30 py-20">
          <p className="px-6 text-center font-medium text-slate-500 italic">
            Select a Member, a Team, and a Pokémon above to start editing
            strategies.
          </p>
        </div>
      )}
    </div>
  );
};

export default EliteFourEditor;
