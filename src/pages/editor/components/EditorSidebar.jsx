import {
  FaBolt,
  FaBook,
  FaDragon,
  FaEgg,
  FaHatWizard,
  FaList,
  FaRedhat,
  FaUsers,
} from "react-icons/fa";

const editorNavigationItems = [
  {
    fileName: "raidsData.json",
    label: "Raids",
    icon: <FaBolt className="text-xl" />,
  },
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
    <div className="flex w-[280px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-[#333] bg-[#1e1e1e]">
      <h3 className="m-0 inline-block border-b-2 border-blue-500 pb-2.5 text-lg font-normal tracking-wider text-white uppercase">
        File Manager
      </h3>

      <div className="flex flex-col gap-1.5">
        <label className="mb-2 text-xs font-bold text-[#a0a0a0] uppercase">
          Select Editor
        </label>
        <nav>
          <ul className="flex flex-col gap-2">
            {/* Pokedex Editor Item */}
            <li>
              <button
                className={`flex w-full items-center gap-3 rounded-md p-2.5 text-sm font-medium transition-colors ${
                  selectedPokedex
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-[#2c2c2c] hover:text-white"
                }`}
                onClick={() => {
                  onSelectFile(null);
                  onSelectPokedex(true);
                }}
              >
                <FaBook className="text-xl" />
                Pokedex
              </button>
            </li>
            {/* Other File Editors */}
            {editorNavigationItems
              .filter((item) => fileList.includes(item.fileName))
              .map((item) => (
                <li key={item.fileName}>
                  <button
                    className={`flex w-full items-center gap-3 rounded-md p-2.5 text-sm font-medium transition-colors ${
                      selectedFileName === item.fileName && !selectedPokedex
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-[#2c2c2c] hover:text-white"
                    }`}
                    onClick={() => {
                      onSelectPokedex(false);
                      onSelectFile(item.fileName);
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            {/* Fallback for files not explicitly mapped, if UniversalJsonEditor is desired for them */}
            {fileList
              .filter(
                (file) =>
                  !editorNavigationItems.some((item) => item.fileName === file)
              )
              .map((file) => (
                <li key={file}>
                  <button
                    className={`flex w-full items-center gap-3 rounded-md p-2.5 text-sm font-medium transition-colors ${
                      selectedFileName === file && !selectedPokedex
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-[#2c2c2c] hover:text-white"
                    }`}
                    onClick={() => {
                      onSelectPokedex(false);
                      onSelectFile(file);
                    }}
                  >
                    <FaList className="text-xl" />
                    {file.replace(".json", "")} (Universal)
                  </button>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      <div className="mt-5 text-xs text-[#888]">
        Editor:{" "}
        <strong className="text-blue-500">
          {selectedPokedex
            ? "Pokedex (Firebase)"
            : selectedFileName &&
                editorNavigationItems.some(
                  (item) => item.fileName === selectedFileName
                )
              ? "Custom"
              : "Universal"}
        </strong>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "💾 Save"}
        </button>
      </div>
    </div>
  );
};

export default EditorSidebar;
