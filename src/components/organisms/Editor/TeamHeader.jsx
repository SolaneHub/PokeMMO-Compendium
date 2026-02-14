import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
const TeamHeader = ({ teamName, teamType, onSave, saving }) => {
  const navigate = useNavigate();
  return (
    <div className="animate-fade-in sticky top-4 z-40 mb-6 flex items-center justify-between rounded-xl border border-white/5 bg-[#0f1014] p-4 shadow-2xl backdrop-blur-md">
      {" "}
      <div className="flex items-center gap-4">
        {" "}
        <button
          onClick={() => navigate("/my-teams")}
          className="hover: rounded-full p-2 transition hover:bg-white/10"
          aria-label="Go back to my teams"
        >
          {" "}
          <ArrowLeft size={24} />{" "}
        </button>{" "}
        <div>
          {" "}
          <h1 className="text-xl font-bold">{teamName}</h1>{" "}
          {teamType && teamType.trim() && (
            <span className="rounded border border-blue-500/30 bg-blue-600/10 px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-blue-400 uppercase">
              {" "}
              {teamType}{" "}
            </span>
          )}{" "}
        </div>{" "}
      </div>{" "}
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50"
      >
        {" "}
        <Save size={18} /> {saving ? "Saving..." : "Save Team"}{" "}
      </button>{" "}
    </div>
  );
};
export default TeamHeader;
