import { useState } from "react";

import StepForm from "./StepForm";

const RedEditor = ({ data, onChange }) => {
  const [teamKey, setTeamKey] = useState(null);
  const [pokemon, setPokemon] = useState(null);

  // Assumiamo che 'data' sia l'oggetto di Red, che contiene { teams: { "Classic": { ... }, "Challenge": { ... } } }
  // Se data è un array (come EliteFour), useremo la logica Array.
  const isArray = Array.isArray(data);

  // Se è un array (vecchio stile), prendiamo il primo elemento o gestiamo errori
  const redData = isArray ? data[0] || {} : data;

  const updateData = (newData) => {
    onChange(isArray ? [newData] : newData);
  };

  const addTeam = () => {
    const name = prompt("Nome del Team (es. 'Mt. Silver'):");
    if (!name) return;
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
    const newRed = JSON.parse(JSON.stringify(redData));
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
      <h3
        style={{
          borderBottom: "2px solid #ff5252",
          paddingBottom: "10px",
          color: "#ff5252",
        }}
      >
        🧢 Red Editor
      </h3>

      <div className="step-card" style={{ borderTop: "4px solid #ff5252" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <label>Team</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <select
                className="universal-input"
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
              <button className="btn btn-success btn-sm" onClick={addTeam}>
                +
              </button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label>Pokémon</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <select
                className="universal-input"
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
                className="btn btn-success btn-sm"
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
        <div className="fade-in">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0",
            }}
          >
            <h4 style={{ margin: 0 }}>Strategia: {pokemon}</h4>
            <button
              className="btn btn-success"
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
              className="step-card"
              style={{ borderLeft: "3px solid #ff5252" }}
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
                className="btn btn-danger btn-sm"
                style={{ marginTop: "10px" }}
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
        <p style={{ textAlign: "center", color: "#666", marginTop: "50px" }}>
          Seleziona un Team e un Pokémon
        </p>
      )}
    </div>
  );
};

export default RedEditor;
