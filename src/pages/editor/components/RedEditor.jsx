import { useState } from "react";

import StepForm from "@/pages/editor/components/StepForm";

const RedEditor = ({ data, onChange }) => {
  const [teamKey, setTeamKey] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const isArray = Array.isArray(data);
  const redData = isArray ? data[0] || {} : data;

  const updateData = (newData) => {
    onChange(isArray ? [newData] : newData);
  };

  const addTeam = () => {
    const name = prompt("Team Name (e.g. 'Mt. Silver'):");
    if (!name || name.trim() === "") return;
    const newRed = {
      ...redData,
      teams: {
        ...(redData.teams || {}),
        [name]: { pokemonNames: [], pokemonStrategies: {} },
      },
    };
    updateData(newRed);
    setTeamKey(name);
  };

  const addPokemon = () => {
    if (!teamKey) return;
    const name = prompt("Pokémon Name:");
    if (!name) return;
    const team = redData.teams[teamKey];
    const newTeam = {
      ...team,
      pokemonNames: [...(team.pokemonNames || []), name],
      pokemonStrategies: { ...(team.pokemonStrategies || {}), [name]: [] },
    };
    const newRed = {
      ...redData,
      teams: { ...redData.teams, [teamKey]: newTeam },
    };
    updateData(newRed);
    setPokemon(name);
  };

  const updateStrategies = (newStrat) => {
    const newRed = structuredClone(redData);
    newRed.teams[teamKey].pokemonStrategies[pokemon] = newStrat;
    updateData(newRed);
  };

  const strategies =
    (teamKey &&
      pokemon &&
      redData.teams?.[teamKey]?.pokemonStrategies?.[pokemon]) ||
    [];

  return (
    <div>
      <title>Editor: Red</title>
      <h3 className="mb-5 border-b-2 border-red-500 pb-2.5 text-xl font-bold text-red-500">
        🧢 Red Editor
      </h3>

      <div className="mb-5 rounded-md border border-t-4 border-[#333] border-t-red-500 bg-[#1e1e1e] p-5 shadow-sm">
        <div className="flex flex-wrap gap-5">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
              Team
            </label>
            <div className="flex gap-1.5">
              <select
                className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                value={teamKey || ""}
                onChange={(e) => {
                  setTeamKey(e.target.value);
                  setPokemon(null);
                }}
              >
                <option value="">-- Select Team --</option>
                {redData.teams &&
                  Object.keys(redData.teams).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
              </select>
              <button
                className="cursor-pointer rounded border-none bg-green-600 px-2.5 py-2 text-sm font-bold text-white transition-all hover:bg-green-700 active:translate-y-[1px]"
                onClick={addTeam}
              >
                +
              </button>
            </div>
          </div>
          <div className="min-w-[200px] flex-1">
            <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
              Pokémon
            </label>
            <div className="flex gap-1.5">
              <select
                className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
                value={pokemon || ""}
                onChange={(e) => setPokemon(e.target.value)}
                disabled={!teamKey}
              >
                <option value="">-- Select Pokémon --</option>
                {teamKey &&
                  redData.teams[teamKey].pokemonStrategies &&
                  Object.keys(redData.teams[teamKey].pokemonStrategies).map(
                    (p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    )
                  )}
              </select>
              <button
                className="cursor-pointer rounded border-none bg-green-600 px-2.5 py-2 text-sm font-bold text-white transition-all hover:bg-green-700 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={addPokemon}
                disabled={!teamKey}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {pokemon ? (
        <div className="animate-[fade-in_0.3s_ease-out]">
          <div className="my-5 flex items-center justify-between">
            <h4 className="m-0 text-lg font-bold text-white">
              Strategy: <span className="text-red-400">{pokemon}</span>
            </h4>
            <button
              className="cursor-pointer rounded border-none bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 active:translate-y-[1px]"
              onClick={() =>
                updateStrategies([
                  ...strategies,
                  { type: "main", player: "", variations: [] },
                ])
              }
            >
              + Add Step
            </button>
          </div>
          {strategies.map((step, i) => (
            <div
              key={i}
              className="mb-4 rounded-md border border-l-[3px] border-[#333] border-l-red-500 bg-[#1e1e1e] p-5 shadow-sm"
            >
              <StepForm
                step={step}
                onChange={(upd) => {
                  const ns = [...strategies];
                  ns[i] = upd;
                  updateStrategies(ns);
                }}
              />
              <button
                className="mt-2.5 cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
                onClick={() =>
                  updateStrategies(strategies.filter((_, x) => x !== i))
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-[#666] italic">
          Select a Team and a Pokémon
        </p>
      )}
    </div>
  );
};

export default RedEditor;
