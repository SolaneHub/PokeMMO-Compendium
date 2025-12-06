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
    const name = prompt("Nome del Team (es. 'Mt. Silver'):");
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
    const name = prompt("Nome Pokémon:");
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
      <h3 className="border-b-2 border-red-500 pb-2.5 text-red-500 text-xl font-bold mb-5">
        🧢 Red Editor
      </h3>

      <div className="bg-[#1e1e1e] border border-[#333] border-t-4 border-t-red-500 rounded-md shadow-sm p-5 mb-5">
        <div className="flex gap-5 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">Team</label>
            <div className="flex gap-1.5">
              <select
                className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                value={teamKey || ""}
                onChange={(e) => {
                  setTeamKey(e.target.value);
                  setPokemon(null);
                }}
              >
                <option value="">-- Seleziona Team --</option>
                {redData.teams &&
                  Object.keys(redData.teams).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
              </select>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-2.5 py-2 text-sm font-bold cursor-pointer transition-all active:translate-y-[1px]" 
                onClick={addTeam}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">Pokémon</label>
            <div className="flex gap-1.5">
              <select
                className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                value={pokemon || ""}
                onChange={(e) => setPokemon(e.target.value)}
                disabled={!teamKey}
              >
                <option value="">-- Seleziona Pokémon --</option>
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
                className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-2.5 py-2 text-sm font-bold cursor-pointer transition-all active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="flex justify-between items-center my-5">
            <h4 className="m-0 text-lg font-bold text-white">Strategia: <span className="text-red-400">{pokemon}</span></h4>
            <button
              className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-4 py-2 text-sm font-medium cursor-pointer transition-all active:translate-y-[1px]"
              onClick={() =>
                updateStrategies([
                  ...strategies,
                  { type: "main", player: "", variations: [] },
                ])
              }
            >
              + Aggiungi Step
            </button>
          </div>
          {strategies.map((step, i) => (
            <div
              key={i}
              className="bg-[#1e1e1e] border border-[#333] rounded-md shadow-sm mb-4 p-5 border-l-[3px] border-l-red-500"
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
                className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer mt-2.5 transition-all"
                onClick={() =>
                  updateStrategies(strategies.filter((_, x) => x !== i))
                }
              >
                Rimuovi
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[#666] mt-12 italic">
          Seleziona un Team e un Pokémon
        </p>
      )}
    </div>
  );
};

export default RedEditor;