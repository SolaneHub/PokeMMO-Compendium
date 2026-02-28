import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EliteFourMember } from "@/utils/eliteFourMembers";

import MemberSelection from "./MemberSelection";

const mockMembers: EliteFourMember[] = [
  { name: "Lance", type: "Dragon", image: "Lance.png", region: "Kanto" },
  { name: "Lorelei", type: "Ice", image: "Lorelei.png", region: "Kanto" },
];

describe("MemberSelection component", () => {
  it("renders the title", () => {
    render(
      <MemberSelection
        filteredEliteFour={[]}
        selectedMember={null}
        onMemberClick={vi.fn()}
      />
    );
    expect(screen.getByText("Select Member")).toBeInTheDocument();
  });

  it("renders elite member cards", () => {
    render(
      <MemberSelection
        filteredEliteFour={mockMembers}
        selectedMember={null}
        onMemberClick={vi.fn()}
      />
    );
    expect(screen.getByText("Lance")).toBeInTheDocument();
    expect(screen.getByText("Lorelei")).toBeInTheDocument();
  });

  it("calls onMemberClick when a member is clicked", () => {
    const handleClick = vi.fn();
    render(
      <MemberSelection
        filteredEliteFour={mockMembers}
        selectedMember={null}
        onMemberClick={handleClick}
      />
    );

    // We can use the closest container with group class that wraps the text inside EliteMemberCard
    const lanceCard = screen.getByText("Lance").closest(".group");
    if (lanceCard) {
      fireEvent.click(lanceCard);
    }

    expect(handleClick).toHaveBeenCalledWith("Lance");
  });
});
