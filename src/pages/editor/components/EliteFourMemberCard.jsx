const EliteFourMemberCard = ({ member, isSelected, onSelect }) => {
  const imageUrl = `/trainers/${member.image}`;

  return (
    <button
      className={`relative flex flex-col items-center rounded-lg border-2 p-3 transition-all duration-200 ease-in-out ${isSelected ? "border-blue-500 bg-blue-900/30 shadow-lg" : "border-gray-700 bg-gray-800 hover:border-blue-500 hover:bg-gray-700"} focus:ring-opacity-50 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
      onClick={() => onSelect(member)}
    >
      <img
        src={imageUrl}
        alt={member.name}
        className="mb-2 h-24 w-24 rounded-full border-2 border-gray-600 bg-gray-900 object-contain"
      />
      <span
        className={`text-lg font-semibold ${isSelected ? "text-blue-300" : "text-white"}`}
      >
        {member.name}
      </span>
      {isSelected && (
        <div className="absolute top-1 right-1 rounded-full bg-blue-900/50 px-2 py-0.5 text-xs font-bold text-blue-400">
          Selected
        </div>
      )}
    </button>
  );
};

export default EliteFourMemberCard;
