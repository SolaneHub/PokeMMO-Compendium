import "./EditorPage.css";

import { useEffect, useState } from "react";

// Importiamo i 5 Editor Specifici
import EliteFourEditor from "./components/EliteFourEditor";
import PickupEditor from "./components/PickupEditor";
import PokedexEditor from "./components/PokedexEditor";
import RaidsEditor from "./components/RaidsEditor";
import RedEditor from "./components/RedEditor";
import UniversalJsonEditor from "./components/UniversalJsonEditor"; // Fallback

const EditorPage = () => {
  const [fileList, setFileList] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);

  // CONFIGURAZIONE: Associa il nome esatto del file JSON al suo Editor
  const EDITOR_MAPPING = {
    "eliteFourData.json": EliteFourEditor,
    "raidsData.json": RaidsEditor,
    "pokedex.json": PokedexEditor, // <--- CORRETTO: era "pokedexData.json"
    "pickupData.json": PickupEditor,
    "redData.json": RedEditor,
  };

  // 1. Carica lista file
  useEffect(() => {
    fetch("http://localhost:3001/api/files")
      .then((res) => res.json())
      .then((data) => {
        setFileList(data);
        // Se c'è pokedex.json, prova a selezionarlo, altrimenti il primo
        const defaultFile = data.find((f) => f === "pokedex.json") || data[0];
        if (defaultFile) setSelectedFileName(defaultFile);
      })
      .catch((err) => console.error("Error fetching file list:", err));
  }, []);

  // 2. Carica contenuto file
  useEffect(() => {
    if (!selectedFileName) return;
    setLoading(true);
    setFileData(null);

    fetch(`http://localhost:3001/api/data?file=${selectedFileName}`)
      .then((res) => res.json())
      .then((data) => {
        setFileData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading file data:", err);
        setLoading(false);
      });
  }, [selectedFileName]);

  // 3. Salva Modifiche
  const handleSave = async () => {
    if (!fileData || !selectedFileName) return;
    try {
      const res = await fetch(
        `http://localhost:3001/api/data?file=${selectedFileName}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fileData),
        }
      );
      const result = await res.json();
      if (result.success) {
        alert(`✅ ${selectedFileName} salvato con successo!`);
      } else {
        alert("❌ Errore durante il salvataggio");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Errore di rete");
    }
  };

  // Seleziona il componente giusto, o usa quello Universale se il file non è mappato
  const SpecificEditor =
    EDITOR_MAPPING[selectedFileName] || UniversalJsonEditor;

  return (
    <div className="editor-container">
      {/* SIDEBAR */}
      <div className="editor-sidebar">
        <h3>File Manager</h3>
        <label>File Attivo:</label>
        <select
          value={selectedFileName}
          onChange={(e) => setSelectedFileName(e.target.value)}
        >
          {fileList.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <div style={{ marginTop: "20px", fontSize: "0.85rem", color: "#888" }}>
          Editor in uso: <br />
          <strong style={{ color: "#007bff" }}>
            {EDITOR_MAPPING[selectedFileName]
              ? selectedFileName.replace(".json", "") // Toglie .json per estetica
              : "Universal (Default)"}
          </strong>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Caricamento..." : "💾 Salva Tutto"}
          </button>
        </div>
      </div>

      {/* AREA EDITOR */}
      <div className="editor-main">
        {loading && <p>Caricamento dati in corso...</p>}
        {!loading && fileData && (
          <SpecificEditor data={fileData} onChange={setFileData} />
        )}
      </div>
    </div>
  );
};

export default EditorPage;
