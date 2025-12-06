const EliteFourMemberCard = ({ member, isSelected, onSelect }) => {
  const imageUrl = `/trainers/${member.image}`;

  return (
    <button
      className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 ease-in-out
        ${isSelected ? "border-blue-500 bg-blue-900/30 shadow-lg" : "border-gray-700 bg-gray-800 hover:border-blue-500 hover:bg-gray-700"}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
      onClick={() => onSelect(member)}
    >
      <img
        src={imageUrl}
        alt={member.name}
        className="w-24 h-24 object-contain mb-2 rounded-full border-2 border-gray-600 bg-gray-900"
      />
      <span
        className={`text-lg font-semibold ${isSelected ? "text-blue-300" : "text-white"}`}
      >
        {member.name}
      </span>
      {isSelected && (
        <div className="absolute top-1 right-1 text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-900/50">
          Selected
        </div>
      )}
    </button>
  );
};

export default EliteFourMemberCard;
