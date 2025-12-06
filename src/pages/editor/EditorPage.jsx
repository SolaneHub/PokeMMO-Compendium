import { useEffect, useState } from "react";

import EditorSidebar from "@/pages/editor/components/EditorSidebar";
import EliteFourEditor from "@/pages/editor/components/EliteFourEditor";
import PickupEditor from "@/pages/editor/components/PickupEditor";
import PokedexEditor from "@/pages/editor/components/PokedexEditor";
import RaidsEditor from "@/pages/editor/components/RaidsEditor";
import RedEditor from "@/pages/editor/components/RedEditor";
import UniversalJsonEditor from "@/pages/editor/components/UniversalJsonEditor";
import PageTitle from "@/shared/components/PageTitle";
import { useToast } from "@/shared/components/ToastNotification"; // Import useToast
import { usePersistentState } from "@/shared/utils/usePersistentState";

const EDITOR_MAPPING = {
  "eliteFourData.json": EliteFourEditor,
  "raidsData.json": RaidsEditor,
  "pokedex.json": PokedexEditor,
  "pickupData.json": PickupEditor,
  "redData.json": RedEditor,
  "bossFightsData.json": EliteFourEditor,
  "superTrainersData.json": EliteFourEditor,
};

const API_URL = "http://localhost:3001/api";

const EditorPage = () => {
  const showToast = useToast(); // Use the toast hook
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
        if (!ignore) showToast("Errore nel caricamento del file.", "error"); // Use toast
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [selectedFileName, showToast]);

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
        showToast(`✅ ${selectedFileName} salvato!`, "success"); // Use toast
      } else {
        showToast("❌ Errore server durante il salvataggio.", "error"); // Use toast
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Errore di connessione.", "error"); // Use toast
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
      <EditorSidebar
        fileList={fileList}
        selectedFileName={selectedFileName}
        onSelectFile={setSelectedFileName}
        onSave={handleSave}
        loading={loading}
      />

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
