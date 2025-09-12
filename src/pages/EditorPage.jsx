import React, { useEffect, useState } from "react";
import StepForm from "../components/StepForm";

const EditorPage = () => {
  const [eliteFourData, setEliteFourData] = useState(null);
  const [loading, setLoading] = useState(true);

  // selezioni del navigatore
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [selectedTeamKey, setSelectedTeamKey] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Carica dati dal backend
  useEffect(() => {
    fetch("http://localhost:3001/api/elite-four")
      .then((res) => res.json())
      .then((data) => {
        setEliteFourData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore caricamento dati:", err);
        setLoading(false);
      });
  }, []);

  // Salva i dati sul backend
  const handleSave = async () => {
    if (!eliteFourData) return;
    try {
      const res = await fetch("http://localhost:3001/api/elite-four", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eliteFourData),
      });
      const result = await res.json();
      if (result.success) {
        alert("✅ Dati salvati con successo!");
      } else {
        alert("❌ Errore durante il salvataggio");
      }
    } catch (err) {
      console.error("Errore salvataggio:", err);
      alert("❌ Errore durante il salvataggio");
    }
  };

  if (loading) return <p>Caricamento...</p>;
  if (!eliteFourData) return <p>Nessun dato disponibile</p>;

  // Seleziona steps correnti (se tutto è scelto)
  let steps = [];
  if (selectedMemberIndex !== null && selectedTeamKey && selectedPokemon) {
    steps =
      eliteFourData[selectedMemberIndex].teams[selectedTeamKey]
        .pokemonStrategies[selectedPokemon];
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar Navigatore */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h3>Navigatore</h3>

        {/* Superquattro */}
        <label>Superquattro:</label>
        <select
          value={selectedMemberIndex ?? ""}
          onChange={(e) => {
            setSelectedMemberIndex(
              e.target.value !== "" ? parseInt(e.target.value) : null
            );
            setSelectedTeamKey(null);
            setSelectedPokemon(null);
          }}
        >
          <option value="">-- Seleziona --</option>
          {eliteFourData.map((m, i) => (
            <option key={i} value={i}>
              {m.name} ({m.region})
            </option>
          ))}
        </select>

        {/* Team */}
        {selectedMemberIndex !== null && (
          <>
            <label>Team:</label>
            <select
              value={selectedTeamKey ?? ""}
              onChange={(e) => {
                setSelectedTeamKey(e.target.value || null);
                setSelectedPokemon(null);
              }}
            >
              <option value="">-- Seleziona --</option>
              {Object.keys(eliteFourData[selectedMemberIndex].teams).map(
                (teamKey) => (
                  <option key={teamKey} value={teamKey}>
                    {teamKey}
                  </option>
                )
              )}
            </select>
            <div style={{ marginTop: "5px" }}>
              <button
                onClick={() => {
                  const newTeamName = prompt("Nome del nuovo Team:");
                  if (!newTeamName) return;
                  const newData = [...eliteFourData];
                  newData[selectedMemberIndex].teams[newTeamName] = {
                    pokemonNames: [],
                    pokemonStrategies: {},
                  };
                  setEliteFourData(newData);
                  setSelectedTeamKey(newTeamName);
                }}
              >
                ➕ Aggiungi Team
              </button>

              {selectedTeamKey && (
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Vuoi eliminare il team ${selectedTeamKey}?`
                      )
                    ) {
                      const newData = [...eliteFourData];
                      delete newData[selectedMemberIndex].teams[
                        selectedTeamKey
                      ];
                      setEliteFourData(newData);
                      setSelectedTeamKey(null);
                      setSelectedPokemon(null);
                    }
                  }}
                >
                  ❌ Elimina Team
                </button>
              )}
            </div>
          </>
        )}

        {/* Pokémon */}
        {selectedTeamKey && (
          <>
            <label>Pokémon:</label>
            <select
              value={selectedPokemon ?? ""}
              onChange={(e) => setSelectedPokemon(e.target.value || null)}
            >
              <option value="">-- Seleziona --</option>
              {Object.keys(
                eliteFourData[selectedMemberIndex].teams[selectedTeamKey]
                  .pokemonStrategies
              ).map((poke) => (
                <option key={poke} value={poke}>
                  {poke}
                </option>
              ))}
            </select>
            <div style={{ marginTop: "5px" }}>
              {selectedTeamKey && (
                <button
                  onClick={() => {
                    const newPokemon = prompt("Nome del nuovo Pokémon:");
                    if (!newPokemon) return;
                    const newData = [...eliteFourData];
                    const team =
                      newData[selectedMemberIndex].teams[selectedTeamKey];

                    // aggiungi al team
                    team.pokemonNames.push(newPokemon);
                    team.pokemonStrategies[newPokemon] = [];

                    setEliteFourData(newData);
                    setSelectedPokemon(newPokemon);
                  }}
                >
                  ➕ Aggiungi Pokémon
                </button>
              )}

              {selectedPokemon && (
                <button
                  onClick={() => {
                    if (window.confirm(`Vuoi eliminare ${selectedPokemon}?`)) {
                      const newData = [...eliteFourData];
                      const team =
                        newData[selectedMemberIndex].teams[selectedTeamKey];

                      // rimuovi da entrambe le liste
                      team.pokemonNames = team.pokemonNames.filter(
                        (p) => p !== selectedPokemon
                      );
                      delete team.pokemonStrategies[selectedPokemon];

                      setEliteFourData(newData);
                      setSelectedPokemon(null);
                    }
                  }}
                >
                  ❌ Elimina Pokémon
                </button>
              )}
            </div>
          </>
        )}

        {/* Salva */}
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSave}>💾 Salva su File</button>
        </div>
      </div>

      {/* Editor degli Step */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {selectedMemberIndex !== null && selectedTeamKey && selectedPokemon ? (
          <>
            <h3>
              Modifica Steps → {eliteFourData[selectedMemberIndex].name} →{" "}
              {selectedTeamKey} → {selectedPokemon}
            </h3>
            {steps.map((step, i) => (
              <div key={i} style={{ marginBottom: "15px" }}>
                <StepForm
                  step={step}
                  onChange={(updated) => {
                    const newData = [...eliteFourData];
                    newData[selectedMemberIndex].teams[
                      selectedTeamKey
                    ].pokemonStrategies[selectedPokemon][i] = updated;
                    setEliteFourData(newData);
                  }}
                />
                <button
                  onClick={() => {
                    const newData = [...eliteFourData];
                    newData[selectedMemberIndex].teams[
                      selectedTeamKey
                    ].pokemonStrategies[selectedPokemon] = newData[
                      selectedMemberIndex
                    ].teams[selectedTeamKey].pokemonStrategies[
                      selectedPokemon
                    ].filter((_, idx) => idx !== i);
                    setEliteFourData(newData);
                  }}
                >
                  ❌ Rimuovi Step
                </button>
              </div>
            ))}

            <button
              onClick={() => {
                const newData = [...eliteFourData];
                newData[selectedMemberIndex].teams[
                  selectedTeamKey
                ].pokemonStrategies[selectedPokemon].push({
                  type: "",
                  player: "",
                  warning: "",
                  variations: [],
                });
                setEliteFourData(newData);
              }}
            >
              ➕ Aggiungi Step
            </button>
          </>
        ) : (
          <p>
            Seleziona un Superquattro, un Team e un Pokémon per iniziare a
            modificare
          </p>
        )}
      </div>

      {/* Preview JSON */}
      <div
        style={{
          width: "40%",
          borderLeft: "1px solid #ccc",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        <h3>Preview JSON</h3>
        <pre
          style={{
            background: "#000000ff",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {JSON.stringify(eliteFourData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default EditorPage;
