import { useState } from "react";

import StepForm from "./StepForm";

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
      <h3
        style={{
          borderBottom: "2px solid #e91e63",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        🏰 Editor E4
      </h3>

      <div
        className="step-card"
        style={{
          background: "#252526",
          borderTop: "4px solid #e91e63",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ fontSize: "0.85rem", color: "#aaa" }}>Membro</label>
          <select
            className="universal-input"
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

        
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ fontSize: "0.85rem", color: "#aaa" }}>Team</label>
          <select
            className="universal-input"
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

        
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ fontSize: "0.85rem", color: "#aaa" }}>Pokémon</label>
          <select
            className="universal-input"
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
        <div className="fade-in">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0",
              borderBottom: "1px solid #444",
              paddingBottom: "10px",
            }}
          >
            <h4 style={{ margin: 0, color: "#e91e63" }}>
              Strategia per: <span style={{ color: "#fff" }}>{pokemon}</span>
            </h4>
            <button
              className="btn btn-success"
              onClick={() => updateStrategies([...steps, NEW_STEP_TEMPLATE])}
            >
              + Aggiungi Step
            </button>
          </div>

          
          {steps.length > 0 ? (
            steps.map((step, i) => (
              <div
                key={i}
                className="step-card"
                style={{
                  borderLeft: "3px solid #e91e63",
                  marginBottom: "15px",
                }}
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
            <p style={{ color: "#888", fontStyle: "italic" }}>
              Nessuno step configurato per questo Pokémon.
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            border: "2px dashed #444",
            borderRadius: "8px",
            marginTop: "20px",
            color: "#888",
          }}
        >
          Seleziona un Membro, un Team e un Pokémon per modificare la strategia.
        </div>
      )}
    </div>
  );
};

export default EliteFourEditor;
