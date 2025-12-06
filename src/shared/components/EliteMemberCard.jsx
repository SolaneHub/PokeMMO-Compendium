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
      className={`relative flex flex-col w-36 bg-slate-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 transform 
        ${isSelected ? "scale-105" : "hover:-translate-y-1 hover:shadow-xl"}
      `}
      onClick={() => onMemberClick(member)}
      style={isSelected ? { boxShadow: shadowColor } : {}}
    >
      <p 
        className="text-slate-900 font-bold text-sm text-center py-1 px-2 m-0"
        style={{ background: background }}
      >
        {member.name}
      </p>

      <div className="w-full h-32 bg-slate-700/50">
        <img
          src={`${TRAINER_PATH}${member.image}`}
          alt={member.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/180x120/cccccc/333333?text=${member.name.replace(" ", "+")}`;
          }}
        />
      </div>
    </div>
  );
};

export default EliteMemberCard;