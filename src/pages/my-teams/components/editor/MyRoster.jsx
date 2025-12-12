import { Edit, Plus, Users } from "lucide-react";

const MyRoster = ({ members, onEditSlot }) => {
  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1b20] p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
        <Users size={16} />
        My Roster
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {members.map((member, idx) => (
          <div
            key={idx}
            className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-black/20 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
            onClick={() => onEditSlot(idx)}
          >
            {member ? (
              <img
                src={
                  member.sprite ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.dexId || 0}.png`
                }
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
                }}
                alt={member.name}
                className="h-10 w-10 object-contain"
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
