import { Edit, Map, Send, Trash2, XCircle } from "lucide-react";

import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/atoms/StatusBadge";
import { getSpriteUrlByName } from "@/utils/pokemonImageHelper";
const TeamCard = ({
  team,
  onClick,
  onDelete,
  onSubmit,
  onCancelSubmission,
}) => {
  const status = team.status || "draft";
  const isPending = status === "pending";
  return (
    <div
      onClick={isPending ? undefined : onClick}
      className={`animate-fade-in group relative overflow-hidden rounded-2xl border border-white/5 bg-[#1a1b20] p-5 transition-all duration-300 ${isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:-translate-y-1 hover:border-white/10 hover:shadow-xl"}`}
    >
      {" "}
      {/* Hover Gradient Background */}{" "}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 transition-opacity duration-300 ${isPending ? "opacity-0" : "group-hover:opacity-100"}`}
      />{" "}
      <div className="relative z-10 flex h-full flex-col">
        {" "}
        <div className="mb-4 flex items-start justify-between">
          {" "}
          <div>
            {" "}
            <h3
              className={`text-xl font-bold ${isPending ? "" : "transition-colors group-hover:text-blue-400"}`}
            >
              {" "}
              {team.name}{" "}
            </h3>{" "}
            <div className="mt-1 flex items-center gap-2 text-sm">
              {" "}
              <div className="flex items-center gap-1">
                {" "}
                <Map size={14} /> <span>Elite Four Team</span>{" "}
              </div>{" "}
              <span>•</span> <StatusBadge status={status} />{" "}
            </div>{" "}
          </div>{" "}
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(team.id);
            }}
            className="text-slate-500 hover:text-red-500"
            title="Delete Team"
            icon={Trash2}
          />{" "}
        </div>{" "}
        <div className="mt-auto flex justify-between gap-1 overflow-hidden rounded-lg bg-[#0f1014] p-2">
          {" "}
          {team.members &&
            team.members.slice(0, 6).map((member, idx) => (
              <div
                key={idx}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5"
              >
                {" "}
                {member?.name ? (
                  <img
                    src={getSpriteUrlByName(member.name)}
                    alt={member.name}
                    className="h-full w-full object-contain p-0.5"
                    onError={(e) => {
                      if (member.dexId) {
                        e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.dexId}.png`;
                      } else {
                        e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-xs text-slate-600">?</span>
                )}{" "}
              </div>
            ))}{" "}
          {[...Array(Math.max(0, 6 - (team.members?.length || 0)))].map(
            (_, idx) => (
              <div
                key={`empty-${idx}`}
                className="h-11 w-11 shrink-0 rounded-full border border-dashed border-white/10 bg-white/5 opacity-30"
              ></div>
            )
          )}{" "}
        </div>{" "}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          {" "}
          {!isPending && (
            <span className="flex items-center gap-1 text-sm font-medium text-blue-400 transition-colors group-hover:text-blue-300">
              {" "}
              <Edit size={14} /> Edit Strategies{" "}
            </span>
          )}{" "}
          {onSubmit && status === "draft" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSubmit(team.id);
              }}
              className="h-auto px-3 py-1.5 text-xs font-bold"
              icon={Send}
            >
              {" "}
              Submit{" "}
            </Button>
          )}{" "}
          {onCancelSubmission && status === "pending" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCancelSubmission(team.id);
              }}
              className="h-auto border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:border-red-500/20 hover:bg-red-500/20 hover:text-red-300"
              icon={XCircle}
            >
              {" "}
              Cancel Submission{" "}
            </Button>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default TeamCard;
