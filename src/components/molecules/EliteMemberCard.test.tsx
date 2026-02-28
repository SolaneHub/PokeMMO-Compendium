import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import EliteMemberCard from "./EliteMemberCard";
import { EliteFourMember } from "@/utils/eliteFourMembers";

const mockMember: EliteFourMember = {
  id: "lorelei",
  name: "Lorelei",
  type: "Ice",
  image: "LoreleiLGPE.png",
  region: "Kanto",
};

describe("EliteMemberCard component", () => {
  it("renders member name and image", () => {
    render(
      <EliteMemberCard
        member={mockMember}
        onMemberClick={() => {}}
        isSelected={false}
        background="#ffffff"
      />
    );

    expect(screen.getByText("Lorelei")).toBeInTheDocument();
    const img = screen.getByAltText("Lorelei");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("LoreleiLGPE.png")
    );
  });

  it("calls onMemberClick when clicked", () => {
    const handleClick = vi.fn();
    render(
      <EliteMemberCard
        member={mockMember}
        onMemberClick={handleClick}
        isSelected={false}
        background="#ffffff"
      />
    );

    // Click the card div
    const card = screen.getByText("Lorelei").closest("div.group");
    if (card) {
      fireEvent.click(card);
    }
    expect(handleClick).toHaveBeenCalledWith(mockMember);
  });

  it("applies selected styles when isSelected is true", () => {
    render(
      <EliteMemberCard
        member={mockMember}
        onMemberClick={() => {}}
        isSelected={true}
        background="#ffffff"
        shadowColor="0 0 15px red"
      />
    );

    const card = screen.getByText("Lorelei").closest("div.group");
    expect(card).toHaveClass("scale-105");
    expect(card).toHaveStyle({ boxShadow: "0 0 15px red" });
  });
});
