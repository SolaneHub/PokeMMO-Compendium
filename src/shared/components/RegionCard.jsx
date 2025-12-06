const RegionCard = ({ region, onRegionClick, isSelected }) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 w-40 h-28 rounded-xl cursor-pointer transition-all duration-300 transform 
      ${isSelected ? "scale-105" : "hover:-translate-y-1 hover:shadow-xl shadow-md"}
      `}
      onClick={() => onRegionClick(region)}
      style={{
        backgroundColor: region.bgColor,
        boxShadow: isSelected
          ? `0 4px 14px ${region.bgColor}cc` // Stronger shadow when selected
          : undefined, // Let CSS/Tailwind handle hover shadow otherwise, or inline if needed
      }}
    >
      <h2 className="m-0 text-center text-black font-bold text-lg break-words leading-tight">
        {region.name}
      </h2>
    </div>
  );
};

export default RegionCard;
