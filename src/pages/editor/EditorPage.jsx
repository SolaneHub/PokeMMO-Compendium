import { useEffect, useState, useTransition } from "react";

import EditorSidebar from "@/pages/editor/components/EditorSidebar";
import EliteFourEditor from "@/pages/editor/components/EliteFourEditor";
import PickupEditor from "@/pages/editor/components/PickupEditor";
import PokedexEditor from "@/pages/editor/components/PokedexEditor";
import RaidsEditor from "@/pages/editor/components/RaidsEditor";
import RedEditor from "@/pages/editor/components/RedEditor";
import UniversalJsonEditor from "@/pages/editor/components/UniversalJsonEditor";
import PageTitle from "@/shared/components/PageTitle";
import { useToast } from "@/shared/components/ToastNotification";
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
  const showToast = useToast();
  const [fileList, setFileList] = useState([]);

  const [selectedFileName, setSelectedFileName] = usePersistentState(
    "editor_lastFile",
    ""
  );

  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, startTransition] = useTransition();
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch(`${API_URL}/files`);
        if (!res.ok) throw new Error("Unable to connect to server");

        const data = await res.json();
        setFileList(data);
        setServerError(null);

        if (!selectedFileName || !data.includes(selectedFileName)) {
          const defaultFile = data.find((f) => f === "pokedex.json") || data[0];
          if (defaultFile) setSelectedFileName(defaultFile);
        }
      } catch (err) {
        console.error(err);
        setServerError("Error: Ensure the server (port 3001) is active.");
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
        if (!res.ok) throw new Error("Error fetching data");
        const data = await res.json();
        if (!ignore) setFileData(data);
      } catch (err) {
        console.error(err);
        if (!ignore) showToast("Error loading file.", "error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [selectedFileName, showToast]);

  const handleSave = () => {
    if (!fileData || !selectedFileName) return;

    startTransition(async () => {
      try {
        const res = await fetch(`${API_URL}/data?file=${selectedFileName}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fileData),
        });
        const result = await res.json();
        if (result.success) {
          showToast(`✅ ${selectedFileName} saved!`, "success");
        } else {
          showToast("❌ Server error during save.", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("❌ Connection error.", "error");
      }
    });
  };

  if (serverError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#121212] font-sans text-slate-200">
        <div className="text-center text-red-400">
          <h2 className="mb-2 text-2xl font-bold">⚠️ Backend Unreachable</h2>
          <p>{serverError}</p>
          <p className="mt-2 text-sm text-slate-400">
            Run{" "}
            <code className="rounded bg-slate-800 px-1">npm run server</code> in
            terminal.
          </p>
        </div>
      </div>
    );
  }

  const SpecificEditor =
    EDITOR_MAPPING[selectedFileName] || UniversalJsonEditor;

  return (
    <div className="flex h-screen overflow-hidden bg-[#121212] font-sans text-slate-200">
      <PageTitle title="PokéMMO Compendium: Editor" />

      {/* SIDEBAR */}
      <EditorSidebar
        fileList={fileList}
        selectedFileName={selectedFileName}
        onSelectFile={setSelectedFileName}
        onSave={handleSave}
        loading={isSaving}
      />

      {/* MAIN AREA */}
      <div className="scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-[#1a1a1a] flex-1 overflow-y-auto bg-[#121212] p-8">
        {loading && <p className="text-slate-400">Loading...</p>}
        {!loading && fileData && (
          <SpecificEditor data={fileData} onChange={setFileData} />
        )}
      </div>
    </div>
  );
};

export default EditorPage;
