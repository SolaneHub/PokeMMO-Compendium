import { Edit, Plus, Users } from "lucide-react";

import { getSpriteUrlByName } from "@/utils/pokemonImageHelper";

interface RosterMember {
  name?: string;
  item?: string;
  dexId?: number | string;
}

interface MyRosterProps {
  members: (RosterMember | null)[];
  onEditSlot: (idx: number) => void;
}

const MyRoster = ({ members, onEditSlot }: MyRosterProps) => {
  return (
    <div className="animate-fade-in rounded-xl border border-white/5 bg-[#1a1b20] p-5 text-white">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase">
        <Users size={16} /> My Roster
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {members.map((member, idx) => (
          <div
            key={idx}
            className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-[#0f1014] transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
            role="button"
            tabIndex={0}
            onClick={() => onEditSlot(idx)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                if (e.key === " ") e.preventDefault();
                onEditSlot(idx);
              }
            }}
            aria-label={
              member?.name ? `Edit ${member.name}` : "Add new Pokémon"
            }
          >
            {member?.name ? (
              <img
                src={getSpriteUrlByName(member.name) || ""}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (member.dexId) {
                    target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.dexId}.png`;
                  } else {
                    target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png`;
                  }
                }}
                alt={member.name}
                className="h-full w-full object-contain p-0.5"
                title={`${member.name} (${member.item || "No Item"})`}
              />
            ) : (
              <Plus
                size={20}
                className="text-slate-600 transition-colors group-hover:text-blue-400"
              />
            )}
            {member && (
              <div className="absolute -top-1 -right-1 rounded-full border border-white/10 bg-[#1a1b20] p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Edit size={10} className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRoster;
