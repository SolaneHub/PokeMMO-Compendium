import {
  FaBook,
  FaEgg,
  FaHatWizard,
  FaList,
  FaRedhat,
  FaUsers,
} from "react-icons/fa";

const editorNavigationItems = [
  {
    fileName: "pickupData.json",
    label: "Pickup",
    icon: <FaEgg className="text-xl" />,
  },
  {
    fileName: "redData.json",
    label: "Red Battle",
    icon: <FaRedhat className="text-xl" />,
  },
  {
    fileName: "bossFightsData.json",
    label: "Boss Fights",
    icon: <FaUsers className="text-xl" />,
  },
  {
    fileName: "superTrainersData.json",
    label: "Super Trainers",
    icon: <FaHatWizard className="text-xl" />,
  },
];

const EditorSidebar = ({
  fileList,
  selectedFileName,
  onSelectFile,
  selectedPokedex,
  onSelectPokedex,
  onSave,
  loading,
}) => {
  return (
    <div className="flex w-[280px] shrink-0 flex-col gap-6 overflow-y-auto border-r border-white/5 bg-[#0f1014] p-4">
      <div className="flex flex-col gap-1">
        <h3 className="m-0 text-lg font-bold tracking-tight text-slate-100 uppercase">
          CMS Editor
        </h3>
        <div className="h-1 w-12 rounded-full bg-blue-500" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="mb-2 text-xs font-bold tracking-widest text-slate-500 uppercase">
          Select Editor
        </label>
        <nav>
          <ul className="flex flex-col gap-1.5">
            {/* Pokedex Editor Item */}
            <li>
              <button
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-sm font-semibold transition-all ${
                  selectedPokedex
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
                onClick={() => {
                  onSelectFile(null);
                  onSelectPokedex(true);
                }}
              >
                <FaBook
                  className={selectedPokedex ? "text-white" : "text-blue-400"}
                  size={18}
                />
                Pokedex
              </button>
            </li>
            {/* Other File Editors */}
            {editorNavigationItems
              .filter((item) => fileList.includes(item.fileName))
              .map((item) => {
                const isActive =
                  selectedFileName === item.fileName && !selectedPokedex;
                return (
                  <li key={item.fileName}>
                    <button
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                      }`}
                      onClick={() => {
                        onSelectPokedex(false);
                        onSelectFile(item.fileName);
                      }}
                    >
                      <span
                        className={isActive ? "text-white" : "text-blue-400"}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  </li>
                );
              })}
            {/* Fallback for files not explicitly mapped */}
            {fileList
              .filter(
                (file) =>
                  !editorNavigationItems.some((item) => item.fileName === file)
              )
              .map((file) => {
                const isActive = selectedFileName === file && !selectedPokedex;
                return (
                  <li key={file}>
                    <button
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                      }`}
                      onClick={() => {
                        onSelectPokedex(false);
                        onSelectFile(file);
                      }}
                    >
                      <FaList
                        className={isActive ? "text-white" : "text-slate-500"}
                        size={18}
                      />
                      {file.replace(".json", "")}
                    </button>
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>

      <div className="mt-4 rounded-lg bg-white/5 p-3">
        <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Active View
        </p>
        <p className="mt-1 text-xs font-semibold text-blue-400">
          {selectedPokedex
            ? "Pokedex (Firebase)"
            : selectedFileName &&
                editorNavigationItems.some(
                  (item) => item.fileName === selectedFileName
                )
              ? "Custom Template"
              : "Universal JSON"}
        </p>
      </div>

      <div className="mt-auto border-t border-white/5 pt-4">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditorSidebar;
