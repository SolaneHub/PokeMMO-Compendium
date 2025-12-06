const RaidCard = ({
  raid,
  onRaidClick,
  isSelected,
  displayValue,
  isCompact = false,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group
      ${isCompact ? "w-32 h-16" : "w-40 h-24"}
      ${isCompact ? "font-bold text-lg" : "font-bold text-xl"}
      ${
        isSelected
          ? "scale-105 z-10 bg-blue-600/20 border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          : "bg-[#1e2025] border border-white/5 hover:bg-[#25272e] hover:border-white/20 hover:-translate-y-1"
      }
      `}
      onClick={() => onRaidClick(raid)}
    >
      <h2
        className={`relative z-10 m-0 text-center break-words leading-tight drop-shadow-sm ${isSelected ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"}`}
      >
        {displayValue || raid.name}
      </h2>
    </div>
  );
};

export default RaidCard;
