const TRAINER_PATH = `${import.meta.env.BASE_URL}trainers/`;

const EliteMemberCard = ({
  member,
  onMemberClick,
  isSelected,
  background,
  shadowColor,
}) => {
  return (
    <div
      className={`relative flex flex-col w-36 bg-[#1e2025] border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group
        ${
          isSelected
            ? "scale-105 z-10 border-transparent"
            : "border-white/5 hover:border-white/20 hover:bg-[#25272e] hover:-translate-y-1 hover:shadow-xl"
        }
      `}
      onClick={() => onMemberClick(member)}
      style={
        isSelected
          ? {
              boxShadow: shadowColor || "0 0 15px rgba(255,255,255,0.2)",
              borderColor: "rgba(255,255,255,0.2)",
            }
          : {}
      }
    >
      <div
        className="py-1.5 px-2 text-center"
        style={{ background: background }}
      >
        <p className="text-[#1a1b20] font-bold text-sm m-0 truncate">
          {member.name}
        </p>
      </div>

      <div className="w-full h-32 bg-black/20 relative">
        <img
          src={`${TRAINER_PATH}${member.image}`}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/180x120/cccccc/333333?text=${encodeURIComponent(member.name)}`;
          }}
        />
        {/* Gradient overlay for better text contrast if we overlay text, but here it just adds depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e2025] to-transparent opacity-20" />
      </div>
    </div>
  );
};

export default EliteMemberCard;
