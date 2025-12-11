import { useState } from "react";

const CreateTeamModal = ({ onClose, onCreate, creating }) => {
  const [newTeamName, setNewTeamName] = useState("");

  const handleSubmit = () => {
    onCreate(newTeamName);
  };

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl">
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Create New Team
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-400">
                Team Name
              </label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g. My Kanto Farm Team"
                className="w-full rounded-lg border border-slate-600 bg-slate-900 p-3 text-white outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500"
                autoFocus
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!newTeamName.trim() || creating}
              className="rounded-lg bg-pink-600 px-6 py-2 font-bold text-white shadow-lg transition-all hover:bg-pink-700 hover:shadow-pink-900/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Team"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateTeamModal;
