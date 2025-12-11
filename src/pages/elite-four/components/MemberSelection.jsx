import EliteMemberCard from "@/shared/components/EliteMemberCard";
import { getDualShadow, typeBackgrounds } from "@/shared/utils/pokemonColors";

function MemberSelection({ filteredEliteFour, selectedMember, onMemberClick }) {
  return (
    <div className="animate-[fade-in_0.4s_ease-out] space-y-4">
      <h2 className="text-center text-xl font-semibold text-slate-300">
        Select Member
      </h2>
      <div className="flex flex-wrap justify-center gap-5">
        {filteredEliteFour.map((member) => {
          const memberBackground =
            typeBackgrounds[member.type] || typeBackgrounds[""];
          const shadowStyle = getDualShadow(memberBackground);
          return (
            <EliteMemberCard
              key={member.name}
              member={member}
              onMemberClick={() => onMemberClick(member.name)}
              isSelected={selectedMember === member.name}
              background={memberBackground}
              shadowColor={shadowStyle}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MemberSelection;
