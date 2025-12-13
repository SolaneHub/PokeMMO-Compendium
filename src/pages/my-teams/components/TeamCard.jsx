import { Check, Clock, Edit, Map, Send, Trash2, XCircle } from "lucide-react";

import { getSpriteUrlByName } from "@/shared/utils/pokemonImageHelper";

const TeamCard = ({
  team,
  onClick,
  onDelete,
  onSubmit,
  onCancelSubmission,
}) => {
  const status = team.status || "draft";
  const isPending = status === "pending";

  const getStatusBadge = () => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-green-400">
            <Check size={12} /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-red-400">
            <XCircle size={12} /> Rejected
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
            <Clock size={12} /> Pending
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">Draft</span>;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`animate-fade-in group relative overflow-hidden rounded-2xl border border-white/5 bg-[#1a1b20] p-5 transition-all duration-300 ${
        isPending
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:-translate-y-1 hover:shadow-xl"
      }`}
    >
      {/* Hover Gradient Background (Blue/Cyan for My Teams) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 transition-opacity duration-300 ${
          isPending ? "opacity-0" : "group-hover:opacity-100"
        }`}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3
              className={`text-xl font-bold text-slate-200 ${
                isPending ? "" : "transition-colors group-hover:text-blue-400"
              }`}
            >
              {team.name}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Map size={14} />
                <span>Elite Four Team</span>
              </div>
              <span>•</span>
              {getStatusBadge()}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(team.id);
            }}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
            title="Delete Team"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-auto flex gap-2 overflow-hidden rounded-lg bg-black/20 p-3">
          {team.members &&
            team.members.slice(0, 6).map((member, idx) => (
              <div
                key={idx}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5"
              >
                {member?.name ? ( // Check for member.name existence
                  <img
                    src={getSpriteUrlByName(member.name)}
                    alt={member.name}
                    className="h-full w-full object-contain p-0.5"
                    onError={(e) => {
                      // Fallback to standard PokeAPI sprite if dream world fails
                      if (member.dexId) {
                        e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.dexId}.png`;
                      } else {
                        // Fallback to a generic placeholder if dexId is also missing
                        e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-xs text-slate-600">?</span>
                )}
              </div>
            ))}
          {[...Array(Math.max(0, 6 - (team.members?.length || 0)))].map(
            (_, idx) => (
              <div
                key={`empty-${idx}`}
                className="h-8 w-8 rounded-full border border-dashed border-white/10 bg-white/5 opacity-30"
              ></div>
            )
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          {!isPending && (
            <span className="flex items-center gap-1 text-sm font-medium text-blue-400 transition-colors group-hover:text-blue-300">
              <Edit size={14} />
              Edit Strategies
            </span>
          )}

          {onSubmit && status === "draft" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSubmit(team.id);
              }}
              className="flex items-center gap-1 rounded bg-slate-700/50 px-3 py-1 text-xs font-bold text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              <Send size={12} /> Submit
            </button>
          )}

          {onCancelSubmission && status === "pending" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelSubmission(team.id);
              }}
              className="flex items-center gap-1 rounded bg-red-700/50 px-3 py-1 text-xs font-bold text-red-300 hover:bg-red-600 hover:text-white"
            >
              <XCircle size={12} /> Cancel Submission
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default TeamCard;
