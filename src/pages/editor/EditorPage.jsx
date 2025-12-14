import EditorSidebar from "@/pages/editor/components/EditorSidebar";
import EliteFourEditor from "@/pages/editor/components/EliteFourEditor";
import PickupEditor from "@/pages/editor/components/PickupEditor";
import PokedexEditor from "@/pages/editor/components/PokedexEditor";
import RaidsEditor from "@/pages/editor/components/RaidsEditor";
import RedEditor from "@/pages/editor/components/RedEditor";
import ServerErrorState from "@/pages/editor/components/ServerErrorState";
import UniversalJsonEditor from "@/pages/editor/components/UniversalJsonEditor";
import { useEditorData } from "@/pages/editor/hooks/useEditorData";
import PageTitle from "@/shared/components/PageTitle";

const EDITOR_MAPPING = {
  "eliteFourData.json": EliteFourEditor,
  "raidsData.json": RaidsEditor,
  "pickupData.json": PickupEditor,
  "redData.json": RedEditor,
  "bossFightsData.json": EliteFourEditor,
  "superTrainersData.json": EliteFourEditor,
};

const EditorPage = () => {
  const {
    fileList,
    selectedFileName,
    setSelectedFileName,
    selectedPokedex,
    setSelectedPokedex,
    fileData,
    setFileData,
    loading,
    isSaving,
    serverError,
    handleSave,
  } = useEditorData();

  if (serverError) {
    return <ServerErrorState error={serverError} />;
  }

  const SpecificEditor = selectedPokedex
    ? PokedexEditor
    : EDITOR_MAPPING[selectedFileName] || UniversalJsonEditor;

  return (
    <div className="flex h-screen overflow-hidden bg-[#121212] font-sans text-slate-200">
      <PageTitle title="PokéMMO Compendium: Editor" />

      {/* SIDEBAR */}
      <EditorSidebar
        fileList={fileList}
        selectedFileName={selectedFileName}
        onSelectFile={setSelectedFileName}
        selectedPokedex={selectedPokedex}
        onSelectPokedex={setSelectedPokedex}
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
