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
    <div className="flex animate-[fade-in_0.3s_ease-out] flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100 uppercase">
            Red Battle Editor
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500 italic">
            Configure strategies for Red&apos;s legendary teams.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-t-4 border-white/5 border-t-red-500 bg-[#1a1b20] p-6 shadow-xl">
        <div className="flex flex-wrap gap-6">
          <div className="min-w-[240px] flex-1">
            <label className="mb-2 block text-xs font-black tracking-widest text-slate-500 uppercase">
              Select Team
            </label>
            <div className="flex gap-2">
              <select
                className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-4 py-2 text-slate-100 transition-colors outline-none focus:border-red-500"
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
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 font-bold text-white shadow-lg transition-all hover:bg-red-700 active:scale-95"
                onClick={addTeam}
              >
                +
              </button>
            </div>
          </div>
          <div className="min-w-[240px] flex-1">
            <label className="mb-2 block text-xs font-black tracking-widest text-slate-500 uppercase">
              Select Pokémon
            </label>
            <div className="flex gap-2">
              <select
                className="w-full rounded-lg border border-white/10 bg-[#0f1014] px-4 py-2 text-slate-100 transition-colors outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 font-bold text-white shadow-lg transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="flex animate-[fade-in_0.3s_ease-out] flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h4 className="m-0 text-xl font-bold text-slate-100">
              Strategy vs{" "}
              <span className="font-black text-red-400">{pokemon}</span>
            </h4>
            <button
              className="rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 active:scale-95"
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
          <div className="space-y-4">
            {strategies.map((step, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-l-[5px] border-white/5 border-l-red-500 bg-[#1a1b20] p-6 shadow-lg"
              >
                <StepForm
                  step={step}
                  onChange={(upd) => {
                    const ns = [...strategies];
                    ns[i] = upd;
                    updateStrategies(ns);
                  }}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    className="rounded-lg border border-red-600/20 bg-red-600/10 px-4 py-1.5 text-xs font-bold text-red-400 transition-all hover:bg-red-600 hover:text-white"
                    onClick={() =>
                      updateStrategies(strategies.filter((_, x) => x !== i))
                    }
                  >
                    Remove Step
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-[#1a1b20]/30 py-20">
          <p className="font-medium text-slate-500 italic">
            Select a Team and a Pokémon above to start editing strategies.
          </p>
        </div>
      )}
    </div>
  );
};

export default RedEditor;
