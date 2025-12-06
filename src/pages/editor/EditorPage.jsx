import { useEffect, useState } from "react";

import EliteFourEditor from "@/pages/editor/components/EliteFourEditor";
import PickupEditor from "@/pages/editor/components/PickupEditor";
import PokedexEditor from "@/pages/editor/components/PokedexEditor";
import RaidsEditor from "@/pages/editor/components/RaidsEditor";
import RedEditor from "@/pages/editor/components/RedEditor";
import UniversalJsonEditor from "@/pages/editor/components/UniversalJsonEditor";
import PageTitle from "@/shared/components/PageTitle";
import { usePersistentState } from "@/shared/utils/usePersistentState";

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
  }, [selectedFileName, setSelectedFileName]);

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
      <div className="flex h-screen justify-center items-center bg-[#121212] text-slate-200 font-sans">
        <div className="text-center text-red-400">
          <h2 className="text-2xl font-bold mb-2">
            ⚠️ Backend Non Raggiungibile
          </h2>
          <p>{serverError}</p>
          <p className="text-slate-400 text-sm mt-2">
            Esegui{" "}
            <code className="bg-slate-800 px-1 rounded">npm run server</code>{" "}
            nel terminale.
          </p>
        </div>
      </div>
    );
  }

  const SpecificEditor =
    EDITOR_MAPPING[selectedFileName] || UniversalJsonEditor;

  return (
    <div className="flex h-screen bg-[#121212] text-slate-200 font-sans overflow-hidden">
      <PageTitle title="PokéMMO Compendium: Editor" />

      {/* SIDEBAR */}
      <div className="w-[280px] bg-[#1e1e1e] border-r border-[#333] flex flex-col gap-4 p-5 overflow-y-auto shrink-0">
        <h3 className="text-white text-lg font-normal uppercase tracking-wider border-b-2 border-blue-500 pb-2.5 inline-block m-0">
          File Manager
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#a0a0a0] text-xs font-bold uppercase">
            Select File
          </label>
          <select
            className="w-full bg-[#2c2c2c] border border-[#444] rounded-md text-white text-sm p-2.5 outline-none transition-colors hover:border-[#666] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            value={selectedFileName}
            onChange={(e) => setSelectedFileName(e.target.value)}
          >
            {fileList.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 text-xs text-[#888]">
          Editor:{" "}
          <strong className="text-blue-500">
            {EDITOR_MAPPING[selectedFileName] ? "Custom" : "Universal"}
          </strong>
        </div>

        <div className="mt-auto">
          <button
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-md transition-all active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "..." : "💾 Salva"}
          </button>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 bg-[#121212] overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-[#1a1a1a]">
        {loading && <p className="text-slate-400">Caricamento...</p>}
        {!loading && fileData && (
          <SpecificEditor data={fileData} onChange={setFileData} />
        )}
      </div>
    </div>
  );
};

export default EditorPage;
