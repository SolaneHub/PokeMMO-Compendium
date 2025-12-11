import { Edit, Map, Trash2, Send, Check, Clock, XCircle } from "lucide-react";

const TeamCard = ({ team, onClick, onDelete, onSubmit }) => {
  const status = team.status || 'draft';
  
  const getStatusBadge = () => {
    switch(status) {
      case 'approved':
        return <span className="flex items-center gap-1 text-xs font-bold text-green-400"><Check size={12}/> Approved</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-xs font-bold text-red-400"><XCircle size={12}/> Rejected</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-xs font-bold text-amber-400"><Clock size={12}/> Pending</span>;
      default:
        return <span className="text-xs text-slate-500">Draft</span>;
    }
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-5 transition-all hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-xl"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-white transition-colors group-hover:text-pink-400">
            {team.name}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
            <div className="flex items-center gap-1">
                <Map size={14} />
                <span>Universal Team</span>
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

      <div className="mt-4 flex gap-2 overflow-hidden rounded-lg bg-slate-900/50 p-3">
        {team.members &&
          team.members.slice(0, 6).map((member, idx) => (
            <div
              key={idx}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 bg-slate-700"
            >
              {member ? (
                <img
                  src={
                    member.sprite ||
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.dexId || 0}.png`
                  }
                  alt=""
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-xs text-slate-500">?</span>
              )}
            </div>
          ))}
        {[...Array(Math.max(0, 6 - (team.members?.length || 0)))].map(
          (_, idx) => (
            <div
              key={`empty-${idx}`}
              className="h-8 w-8 rounded-full border border-dashed border-slate-700 bg-slate-800 opacity-50"
            ></div>
          )
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-700 pt-4">
        <span className="flex items-center gap-1 text-sm font-medium text-pink-400 group-hover:underline">
          <Edit size={14} />
          Edit Strategies
        </span>
        
        {onSubmit && status === 'draft' && (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onSubmit(team.id);
                }}
                className="flex items-center gap-1 rounded bg-slate-700 px-3 py-1 text-xs font-bold text-slate-300 hover:bg-slate-600 hover:text-white"
            >
                <Send size={12} /> Submit
            </button>
        )}
      </div>
    </div>
  );
};
export default TeamCard;
