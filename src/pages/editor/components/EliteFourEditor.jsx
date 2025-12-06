import { useState } from "react";

import StepForm from "@/pages/editor/components/StepForm";

const NEW_STEP_TEMPLATE = {
  type: "main",
  player: "",
  warning: "",
  variations: [],
};

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

  return (
    <div>
      <title>Editor: Elite Four</title>
      <h3 className="border-b-2 border-pink-500 pb-2.5 mb-5 text-lg font-semibold text-white">
        🏰 Editor E4
      </h3>

      <div className="bg-[#252526] border border-[#333] border-t-4 border-t-pink-500 rounded-md p-5 flex gap-4 flex-wrap shadow-md mb-5">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[0.85rem] text-[#aaa] block mb-1.5 font-medium">
            Membro
          </label>
          <select
            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
            value={memberIndex ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setMemberIndex(val !== "" ? parseInt(val) : null);
              setTeamKey(null);
              setPokemon(null);
            }}
          >
            <option value="">-- Seleziona Membro --</option>
            {data?.map((m, i) => (
              <option key={i} value={i}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-[0.85rem] text-[#aaa] block mb-1.5 font-medium">
            Team
          </label>
          <select
            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            value={teamKey ?? ""}
            onChange={(e) => {
              setTeamKey(e.target.value);
              setPokemon(null);
            }}
            disabled={memberIndex === null}
          >
            <option value="">-- Seleziona Team --</option>
            {currentMember?.teams &&
              Object.keys(currentMember.teams).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-[0.85rem] text-[#aaa] block mb-1.5 font-medium">
            Pokémon
          </label>
          <select
            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            value={pokemon ?? ""}
            onChange={(e) => setPokemon(e.target.value)}
            disabled={!teamKey}
          >
            <option value="">-- Seleziona Pokémon --</option>
            {currentTeam?.pokemonStrategies &&
              Object.keys(currentTeam.pokemonStrategies).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
          </select>
        </div>
      </div>

      {steps ? (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <div className="flex justify-between items-center my-5 border-b border-[#444] pb-2.5">
            <h4 className="m-0 text-pink-500 font-bold">
              Strategia per: <span className="text-white">{pokemon}</span>
            </h4>
            <button
              className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-4 py-2 text-sm font-medium cursor-pointer transition-all active:translate-y-[1px]"
              onClick={() => updateStrategies([...steps, NEW_STEP_TEMPLATE])}
            >
              + Aggiungi Step
            </button>
          </div>

          {steps.length > 0 ? (
            steps.map((step, i) => (
              <div
                key={i}
                className="bg-[#1e1e1e] border border-[#333] rounded-md shadow-sm mb-4 p-5 border-l-[3px] border-l-pink-500"
              >
                <div className="flex justify-between mb-2.5">
                  <strong className="text-pink-500">Step {i + 1}</strong>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
                    onClick={() =>
                      updateStrategies(steps.filter((_, idx) => idx !== i))
                    }
                  >
                    Elimina Step
                  </button>
                </div>

                <StepForm
                  step={step}
                  onChange={(updatedStep) => {
                    const newSteps = [...steps];
                    newSteps[i] = updatedStep;
                    updateStrategies(newSteps);
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-[#888] italic">
              Nessuno step configurato per questo Pokémon.
            </p>
          )}
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
