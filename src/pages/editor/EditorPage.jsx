import "./EditorPage.css";

import { useEffect, useState } from "react";

import { usePersistentState } from "@/shared/utils/usePersistentState";

import EliteFourEditor from "./components/EliteFourEditor";
import PickupEditor from "./components/PickupEditor";
import PokedexEditor from "./components/PokedexEditor";
import RaidsEditor from "./components/RaidsEditor";
import RedEditor from "./components/RedEditor";
import UniversalJsonEditor from "./components/UniversalJsonEditor";

const EDITOR_MAPPING = {
  "eliteFourData.json": EliteFourEditor,
  "raidsData.json": RaidsEditor,
  "pokedex.json": PokedexEditor,
  "pickupData.json": PickupEditor,
  "redData.json": RedEditor,
};

const API_URL = "http://localhost:3001/api";

const EditorPage = () => {
  const [fileList, setFileList] = useState([]);

  const [selectedFileName, setSelectedFileName] = usePersistentState(
    "editor_lastFile",
    ""
  );

  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch(`${API_URL}/files`);
        if (!res.ok) throw new Error("Impossibile contattare il server");

        const data = await res.json();
        setFileList(data);
        setServerError(null);

        if (!selectedFileName || !data.includes(selectedFileName)) {
          const defaultFile = data.find((f) => f === "pokedex.json") || data[0];
          if (defaultFile) setSelectedFileName(defaultFile);
        }
      } catch (err) {
        console.error(err);
        setServerError(
          "Errore: Assicurati che il server (port 3001) sia attivo."
        );
      }
    }
    fetchFiles();
  }, []);

  useEffect(() => {
    if (!selectedFileName) return;

    let ignore = false;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/data?file=${selectedFileName}`);
        if (!res.ok) throw new Error("Errore fetch dati");
        const data = await res.json();
        if (!ignore) setFileData(data);
      } catch (err) {
        console.error(err);
        if (!ignore) alert("Errore nel caricamento del file.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [selectedFileName]);

  const handleSave = async () => {
    if (!fileData || !selectedFileName) return;
    try {
      const res = await fetch(`${API_URL}/data?file=${selectedFileName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileData),
      });
      const result = await res.json();
      if (result.success) {
        alert(`✅ ${selectedFileName} salvato!`);
      } else {
        alert("❌ Errore server durante il salvataggio.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Errore di connessione.");
    }
  };

  if (serverError) {
    return (
      <div
        className="editor-container"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div style={{ textAlign: "center", color: "#ff6b81" }}>
          <h2>⚠️ Backend Non Raggiungibile</h2>
          <p>{serverError}</p>
          <p style={{ color: "#ccc", fontSize: "0.9rem" }}>
            Esegui <code>npm run server</code> nel terminale.
          </p>
        </div>
      </div>
    );
  }

  const SpecificEditor =
    EDITOR_MAPPING[selectedFileName] || UniversalJsonEditor;

  return (
    <div className="editor-container">
      <title>Editor: {selectedFileName || "File Manager"}</title>

      {/* SIDEBAR */}
      <div className="editor-sidebar">
        <h3>File Manager</h3>
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
          Editor:{" "}
          <strong style={{ color: "#007bff" }}>
            {EDITOR_MAPPING[selectedFileName] ? "Custom" : "Universal"}
          </strong>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "..." : "💾 Salva"}
          </button>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="editor-main">
        {loading && <p>Caricamento...</p>}
        {!loading && fileData && (
          <SpecificEditor data={fileData} onChange={setFileData} />
        )}
      </div>
    </div>
  );
};

export default EditorPage;
