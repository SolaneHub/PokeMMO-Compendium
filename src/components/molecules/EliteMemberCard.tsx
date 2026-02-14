import { EliteFourMember } from "@/utils/eliteFourMembers";

interface EliteMemberCardProps {
  member: EliteFourMember;
  onMemberClick: (member: EliteFourMember) => void;
  isSelected: boolean;
  background: string;
  shadowColor?: string;
}

const TRAINER_PATH = `${import.meta.env.BASE_URL}trainers/`;

const EliteMemberCard = ({
  member,
  onMemberClick,
  isSelected,
  background,
  shadowColor,
}: EliteMemberCardProps) => {
  return (
    <div
      className={`group relative flex w-36 cursor-pointer flex-col overflow-hidden rounded-2xl border bg-[#1e2025] transition-all duration-300 ${
        isSelected
          ? "z-10 scale-105 border-transparent"
          : "border-white/5 hover:-translate-y-1 hover:border-white/20 hover:bg-[#25272e] hover:shadow-xl"
      } `}
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
        className="px-2 py-1.5 text-center"
        style={{ background: background }}
      >
        <p className="m-0 truncate text-sm font-bold text-[#1a1b20]">
          {member.name}
        </p>
      </div>
      <div className="relative h-32 w-full bg-black/20">
        <img
          src={`${TRAINER_PATH}${member.image}`}
          alt={member.name}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/180x120/cccccc/333333?text=${encodeURIComponent(member.name)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e2025] to-transparent opacity-20" />
      </div>
    </div>
  );
};

export default EliteMemberCard;
