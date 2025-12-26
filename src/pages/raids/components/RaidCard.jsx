const RaidCard = ({
  raid,
  onRaidClick,
  isSelected,
  displayValue,
  isCompact = false,
}) => {
  return (
    <div
      className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl p-4 transition-all duration-300 ${isCompact ? "h-16 w-32" : "h-24 w-40"} ${isCompact ? "text-lg font-bold" : "text-xl font-bold"} ${
        isSelected
          ? "z-10 scale-105 border border-blue-500 bg-blue-600/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          : "border border-white/5 bg-[#1a1b20] hover:-translate-y-1 hover:border-white/20 hover:bg-white/5"
      } `}
      onClick={() => onRaidClick(raid)}
    >
      <h2
        className={`relative z-20 m-0 text-center leading-tight break-words drop-shadow-sm ${
          isSelected
            ? "text-blue-400"
            : "text-slate-400 group-hover:text-slate-100"
        }`}
      >
        {displayValue || raid.name}
      </h2>
    </div>
  );
};

export default RaidCard;
