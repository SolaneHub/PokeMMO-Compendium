import { useState } from "react";

import StepForm from "./StepForm";

// TEMPLATE PER UN NUOVO POKÉMON NELLA STRATEGIA
const STRATEGY_TEMPLATE = [
  { type: "main", player: "Start battle...", warning: "", variations: [] },
];

const EliteFourEditor = ({ data, onChange }) => {
  const [memberIndex, setMemberIndex] = useState(null);
  const [teamKey, setTeamKey] = useState(null);
  const [pokemon, setPokemon] = useState(null);

  // --- GESTIONE AGGIUNTE ---
  const addMember = () => {
    const name = prompt("Nome del nuovo Membro (es. Lance):");
    if (!name) return;
    const newMember = { name, region: "Kanto", type: "Unknown", teams: {} };
    onChange([...data, newMember]);
    setMemberIndex(data.length); // Seleziona il nuovo
  };

  const addTeam = () => {
    if (memberIndex === null) return;
    const name = prompt("Nome del Team (es. 'Round 2' o 'Reckless'):");
    if (!name) return;

    const newData = [...data];
    // Inizializza l'oggetto teams se manca
    if (!newData[memberIndex].teams) newData[memberIndex].teams = {};

    newData[memberIndex].teams[name] = {
      pokemonNames: [],
      pokemonStrategies: {},
    };
    onChange(newData);
    setTeamKey(name);
  };

  const addPokemon = () => {
    if (memberIndex === null || !teamKey) return;
    const name = prompt("Nome del Pokémon (es. Garchomp):");
    if (!name) return;

    const newData = [...data];
    const currentTeam = newData[memberIndex].teams[teamKey];

    // Aggiorna liste
    if (!currentTeam.pokemonNames) currentTeam.pokemonNames = [];
    if (!currentTeam.pokemonNames.includes(name))
      currentTeam.pokemonNames.push(name);

    // Inizializza strategia
    if (!currentTeam.pokemonStrategies) currentTeam.pokemonStrategies = {};
    currentTeam.pokemonStrategies[name] = STRATEGY_TEMPLATE;

    onChange(newData);
    setPokemon(name);
  };

  // --- UPDATE LOGIC ---
  const updateStrategies = (newStrategies) => {
    const newData = [...data];
    newData[memberIndex].teams[teamKey].pokemonStrategies[pokemon] =
      newStrategies;
    onChange(newData);
  };

  // Safe access ai dati
  const currentMember = memberIndex !== null ? data[memberIndex] : null;
  const currentTeam =
    currentMember && teamKey ? currentMember.teams?.[teamKey] : null;
  const steps =
    currentTeam && pokemon ? currentTeam.pokemonStrategies?.[pokemon] : null;

  return (
    <div>
      <h3
        style={{
          borderBottom: "2px solid #e91e63",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        🏰 Editor Superquattro & Leader
      </h3>

      {/* NAVIGAZIONE A CASCATA */}
      <div
        className="step-card"
        style={{
          background: "#252526",
          border: "1px solid #444",
          borderTop: "4px solid #e91e63",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "15px",
          }}
        >
          {/* 1. MEMBRO */}
          <div>
            <label>1. Membro</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <select
                className="universal-input"
                value={memberIndex ?? ""}
                onChange={(e) => {
                  setMemberIndex(
                    e.target.value !== "" ? parseInt(e.target.value) : null
                  );
                  setTeamKey(null);
                  setPokemon(null);
                }}
              >
                <option value="">-- Seleziona --</option>
                {data.map((m, i) => (
                  <option key={i} value={i}>
                    {m.name} ({m.region})
                  </option>
                ))}
              </select>
              <button className="btn btn-success btn-sm" onClick={addMember}>
                +
              </button>
            </div>
          </div>

          {/* 2. TEAM */}
          <div>
            <label>2. Team</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <select
                className="universal-input"
                value={teamKey ?? ""}
                onChange={(e) => {
                  setTeamKey(e.target.value);
                  setPokemon(null);
                }}
                disabled={memberIndex === null}
              >
                <option value="">-- Seleziona --</option>
                {currentMember?.teams &&
                  Object.keys(currentMember.teams).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
              </select>
              <button
                className="btn btn-success btn-sm"
                onClick={addTeam}
                disabled={memberIndex === null}
              >
                +
              </button>
            </div>
          </div>

          {/* 3. POKEMON */}
          <div>
            <label>3. Pokémon</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <select
                className="universal-input"
                value={pokemon ?? ""}
                onChange={(e) => setPokemon(e.target.value)}
                disabled={!teamKey}
              >
                <option value="">-- Seleziona --</option>
                {currentTeam?.pokemonStrategies &&
                  Object.keys(currentTeam.pokemonStrategies)
                    .sort()
                    .map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
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

      {/* AREA EDITOR */}
      {pokemon && steps ? (
        <div className="fade-in">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0 10px 0",
              borderBottom: "1px solid #333",
              paddingBottom: "10px",
            }}
          >
            <h4 style={{ margin: 0 }}>
              Strategia:{" "}
              <span style={{ color: "#e91e63", fontSize: "1.2em" }}>
                {pokemon}
              </span>
            </h4>
            <button
              className="btn btn-success"
              onClick={() =>
                updateStrategies([
                  ...steps,
                  { type: "main", player: "", variations: [] },
                ])
              }
            >
              ➕ Aggiungi Step
            </button>
          </div>

          {steps.length === 0 && (
            <p
              style={{
                color: "#888",
                fontStyle: "italic",
                textAlign: "center",
                padding: "20px",
              }}
            >
              Nessun passo definito.
            </p>
          )}

          {steps.map((step, i) => (
            <div
              key={i}
              className="step-card"
              style={{ borderLeft: "3px solid #e91e63" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <strong style={{ color: "#e91e63" }}>Step {i + 1}</strong>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    updateStrategies(steps.filter((_, idx) => idx !== i))
                  }
                >
                  🗑️ Rimuovi
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
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#555",
            border: "2px dashed #333",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        >
          {teamKey ? (
            <>
              <h3>Nessun Pokémon Selezionato</h3>
              <button className="btn btn-primary" onClick={addPokemon}>
                ➕ Aggiungi Primo Pokémon
              </button>
            </>
          ) : (
            <p>Usa i menu in alto per iniziare.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EliteFourEditor;
