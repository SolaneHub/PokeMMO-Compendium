const RegionCard = ({ region, onRegionClick, isSelected }) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 w-40 h-24 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group
      ${
        isSelected
          ? "scale-105 z-10 shadow-lg ring-2 ring-white/50"
          : "hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-white/20"
      }
      `}
      onClick={() => onRegionClick(region)}
      style={{
        backgroundColor: region.bgColor,
      }}
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <h2 className="relative z-10 m-0 text-center text-[#1a1b20] font-bold text-lg break-words leading-tight drop-shadow-sm">
        {region.name}
      </h2>
    </div>
  );
};

export default RegionCard;
