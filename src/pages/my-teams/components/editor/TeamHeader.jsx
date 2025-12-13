import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeamHeader = ({ teamName, onSave, saving }) => {
  const navigate = useNavigate();
  return (
    <div className="animate-fade-in sticky top-4 z-40 mb-6 flex items-center justify-between rounded-xl border border-white/5 bg-[#1a1b20] p-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/my-teams")}
          className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">{teamName}</h1>
          <span className="rounded border border-blue-500/30 bg-blue-900/30 px-2 py-0.5 font-mono text-xs text-blue-400">
            Elite Four Team
          </span>
        </div>
      </div>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50"
      >
        <Save size={18} />
        {saving ? "Saving..." : "Save Team"}
      </button>
    </div>
  );
};
export default TeamHeader;
