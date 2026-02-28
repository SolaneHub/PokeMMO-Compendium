import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EliteFourMember } from "@/utils/eliteFourMembers";

import EliteMemberCard from "./EliteMemberCard";

const mockMember: EliteFourMember = {
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
        onMemberClick={vi.fn()}
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

  it("handles image load errors and sets a placeholder", () => {
    render(
      <EliteMemberCard
        member={mockMember}
        onMemberClick={vi.fn()}
        isSelected={false}
        background="#ffffff"
      />
    );

    const img = screen.getByAltText("Lorelei");
    fireEvent.error(img);

    expect(img).toHaveAttribute("src", expect.stringContaining("placehold.co"));
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
        onMemberClick={vi.fn()}
        isSelected={true}
        background="#ffffff"
        shadowColor="0 0 15px red"
      />
    );

    const card = screen.getByText("Lorelei").closest("div.group");
    expect(card).toHaveClass("scale-105");
    expect(card).toHaveStyle({ boxShadow: "0 0 15px red" });
  });

  it("applies default shadow when isSelected is true and no shadowColor is provided", () => {
    render(
      <EliteMemberCard
        member={mockMember}
        onMemberClick={vi.fn()}
        isSelected={true}
        background="#ffffff"
      />
    );

    const card = screen.getByText("Lorelei").closest("div.group");
    expect(card).toHaveStyle({ boxShadow: "0 0 15px rgba(255,255,255,0.2)" });
  });
});
