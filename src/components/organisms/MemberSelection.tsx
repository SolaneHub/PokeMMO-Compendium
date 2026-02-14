import EliteMemberCard from "@/components/molecules/EliteMemberCard";
import { EliteFourMember } from "@/utils/eliteFourMembers";
import { getDualShadow, typeBackgrounds } from "@/utils/pokemonColors";

interface MemberSelectionProps {
  filteredEliteFour: EliteFourMember[];
  selectedMember: string | null;
  onMemberClick: (memberName: string) => void;
}

function MemberSelection({
  filteredEliteFour,
  selectedMember,
  onMemberClick,
}: MemberSelectionProps) {
  return (
    <div className="animate-[fade-in_0.4s_ease-out] space-y-4">
      <h2 className="text-center text-xl font-semibold text-white">
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
