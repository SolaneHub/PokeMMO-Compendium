import "./EditorPage.css";

import { useEffect, useState } from "react";

import StepForm from "@/pages/editor/components/StepForm.jsx";

const EditorPage = () => {
  const [eliteFourData, setEliteFourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [selectedTeamKey, setSelectedTeamKey] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // * Fetch data from the backend on component mount
  useEffect(() => {
    fetch("http://localhost:3001/api/elite-four")
      .then((res) => res.json())
      .then((data) => {
        setEliteFourData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, []);

  // ! Save changes to the backend
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
        alert("✅ Data saved successfully!");
      } else {
        alert("❌ Error while saving");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Error while saving");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!eliteFourData) return <p>No data available</p>;

  // ? Select current steps for editing (only if Member, Team, and Pokemon are selected)
  let steps = [];
  if (selectedMemberIndex !== null && selectedTeamKey && selectedPokemon) {
    steps =
      eliteFourData[selectedMemberIndex].teams[selectedTeamKey]
        .pokemonStrategies[selectedPokemon];
  }

  // ? Logic to generate the live JSON preview based on current selection depth
  let previewData = eliteFourData;

  if (selectedMemberIndex !== null) {
    previewData = eliteFourData[selectedMemberIndex];

    if (selectedTeamKey) {
      previewData = previewData.teams[selectedTeamKey];

      if (selectedPokemon) {
        previewData = previewData.pokemonStrategies[selectedPokemon];
      }
    }
  }

  return (
    <div className="editor-container">
      {/* Sidebar Navigator */}
      <div className="editor-sidebar">
        <h3>Navigator</h3>

        {/* Elite Four Member Selection */}
        <label>Elite Four:</label>
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
          <option value="">-- Select --</option>
          {eliteFourData.map((m, i) => (
            <option key={i} value={i}>
              {m.name} ({m.region})
            </option>
          ))}
        </select>

        {/* Team Selection */}
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
              <option value="">-- Select --</option>
              {Object.keys(eliteFourData[selectedMemberIndex].teams).map(
                (teamKey) => (
                  <option key={teamKey} value={teamKey}>
                    {teamKey}
                  </option>
                )
              )}
            </select>
            <div>
              <button
                className="btn btn-success"
                onClick={() => {
                  const newTeamName = prompt("New Team Name:");
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
                ➕ Add Team
              </button>

              {selectedTeamKey && (
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete team ${selectedTeamKey}?`
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
                  ❌ Delete Team
                </button>
              )}
            </div>
          </>
        )}

        {/* Pokémon Selection */}
        {selectedTeamKey && (
          <>
            <label>Pokémon:</label>
            <select
              value={selectedPokemon ?? ""}
              onChange={(e) => setSelectedPokemon(e.target.value || null)}
            >
              <option value="">-- Select --</option>
              {Object.keys(
                eliteFourData[selectedMemberIndex].teams[selectedTeamKey]
                  .pokemonStrategies
              )
                .sort((a, b) => a.localeCompare(b))
                .map((poke) => (
                  <option key={poke} value={poke}>
                    {poke}
                  </option>
                ))}
            </select>
            <div>
              {selectedTeamKey && (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    const newPokemon = prompt("New Pokémon Name:");

                    if (!newPokemon) return; // Exit if canceled or empty

                    const newData = [...eliteFourData];
                    const team =
                      newData[selectedMemberIndex].teams[selectedTeamKey];

                    // ? Only add to pokemonNames list if not already present
                    if (!team.pokemonNames.includes(newPokemon)) {
                      team.pokemonNames.push(newPokemon);
                    }

                    // ? Ensure strategy object exists
                    if (!team.pokemonStrategies[newPokemon]) {
                      team.pokemonStrategies[newPokemon] = [];
                    }

                    setEliteFourData(newData);
                    setSelectedPokemon(newPokemon);
                  }}
                >
                  ➕ Add Pokémon
                </button>
              )}

              {selectedPokemon && (
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${selectedPokemon}?`
                      )
                    ) {
                      const newData = [...eliteFourData];
                      const team =
                        newData[selectedMemberIndex].teams[selectedTeamKey];

                      // ! Remove from both names list and strategy object
                      team.pokemonNames = team.pokemonNames.filter(
                        (p) => p !== selectedPokemon
                      );
                      delete team.pokemonStrategies[selectedPokemon];

                      setEliteFourData(newData);
                      setSelectedPokemon(null);
                    }
                  }}
                >
                  ❌ Delete Pokémon
                </button>
              )}
            </div>
          </>
        )}

        {/* Save Button */}
        <div>
          <button className="btn btn-primary" onClick={handleSave}>
            💾 Save to File
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="editor-main">
        {selectedMemberIndex !== null && selectedTeamKey && selectedPokemon ? (
          <>
            <h3>
              Editing Steps → {eliteFourData[selectedMemberIndex].name} →{" "}
              {selectedTeamKey} → {selectedPokemon}
            </h3>
            {steps.map((step, i) => (
              <div key={i} className="step-card">
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
                  className="btn btn-danger"
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
                  ❌ Remove Step
                </button>
              </div>
            ))}

            <button
              className="btn btn-success"
              onClick={() => {
                const newData = [...eliteFourData];
                newData[selectedMemberIndex].teams[
                  selectedTeamKey
                ].pokemonStrategies[selectedPokemon].push({
                  type: "",
                  player: "",
                  warning: "",
                });
                setEliteFourData(newData);
              }}
            >
              ➕ Add Step
            </button>
          </>
        ) : (
          <p>
            Please select an Elite Four member, a Team, and a Pokémon to start
            editing.
          </p>
        )}
      </div>

      {/* JSON Preview Panel */}
      <div className="editor-preview">
        <h3>JSON Preview</h3>
        <pre>{JSON.stringify(previewData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default EditorPage;
