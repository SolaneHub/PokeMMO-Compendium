import { Save } from "lucide-react";
const RosterSlotCard = ({ idx, member, onClick }) => {
  const isEmpty = !member?.name;
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isEmpty ? "border-dashed border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10" : "border-white/5 bg-[#111216] hover:border-blue-400/50 hover:shadow-blue-400/10"}`}
    >
      {" "}
      {/* Background decoration */}{" "}
      {!isEmpty && (
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/10 to-transparent blur-2xl transition-all group-hover:from-blue-400/20" />
      )}{" "}
      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        {" "}
        <div className="flex items-start justify-between">
          {" "}
          <div>
            {" "}
            <div className="text-xs font-bold tracking-wider text-slate-500 uppercase transition-colors group-hover:text-blue-400">
              {" "}
              Slot 0{idx + 1}{" "}
            </div>{" "}
            <div
              className={`mt-1 text-xl font-bold ${isEmpty ? "text-slate-500 italic" : ""}`}
            >
              {" "}
              {isEmpty ? "Empty Slot" : member.name}{" "}
            </div>{" "}
          </div>{" "}
          {/* Placeholder Icon */}{" "}
          {isEmpty ? (
            <div className="group-hover: rounded-full bg-white/5 p-2 text-slate-500">
              {" "}
              <Save size={20} className="rotate-45" />{" "}
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-gradient-to-br from-slate-800 to-slate-900 text-lg shadow-inner">
              {" "}
              {member.name.charAt(0)}{" "}
            </div>
          )}{" "}
        </div>{" "}
        {!isEmpty && (
          <div className="space-y-2">
            {" "}
            <div className="flex items-center justify-between rounded bg-black/20 px-3 py-2 text-xs">
              {" "}
              <span className="">Item</span>{" "}
              <span
                className={
                  member.item ? "text-blue-400" : "text-slate-500 italic"
                }
              >
                {" "}
                {member.item || "None"}{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex items-center justify-between rounded bg-black/20 px-3 py-2 text-xs">
              {" "}
              <span className="">Nature</span>{" "}
              <span
                className={
                  member.nature ? "text-yellow-400" : "text-slate-500 italic"
                }
              >
                {" "}
                {member.nature || "Neutral"}{" "}
              </span>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {isEmpty && (
          <div className="mt-auto flex items-center justify-center pt-4 text-xs font-medium text-slate-500 group-hover:text-blue-400">
            {" "}
            + Click to Configure{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
export default RosterSlotCard;
