const EliteFourMemberCard = ({ member, isSelected, onSelect }) => {
  const imageUrl = `/trainers/${member.image}`;

  return (
    <button
      className={`relative flex flex-col items-center rounded-xl border-2 p-4 transition-all duration-200 ease-in-out ${
        isSelected
          ? "border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-900/20"
          : "border-white/5 bg-[#1a1b20] hover:border-white/20 hover:bg-white/5"
      } focus:ring-opacity-50 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
      onClick={() => onSelect(member)}
    >
      <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full border-2 border-white/10 bg-[#0f1014]">
        <img
          src={imageUrl}
          alt={member.name}
          className="h-full w-full object-contain object-top"
        />
      </div>
      <span
        className={`text-lg font-bold ${isSelected ? "text-blue-400" : "text-slate-200"}`}
      >
        {member.name}
      </span>
      {isSelected && (
        <div className="absolute top-2 right-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
          Selected
        </div>
      )}
    </button>
  );
};

export default EliteFourMemberCard;
