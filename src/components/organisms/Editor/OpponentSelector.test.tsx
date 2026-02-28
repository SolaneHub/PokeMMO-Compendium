import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EliteFourMember } from "@/utils/eliteFourMembers";

import OpponentSelector from "./OpponentSelector";

const mockMembers: EliteFourMember[] = [
  { name: "Lorelei", type: "Ice", image: "", region: "Kanto" },
  { name: "Bruno", type: "Fighting", image: "", region: "Kanto" },
];

describe("OpponentSelector component", () => {
  it("renders regions and members", () => {
    render(
      <OpponentSelector
        regions={["Kanto", "Johto"]}
        selectedRegion={null}
        onSelectRegion={() => {
          /* noop */
        }}
        availableMembers={mockMembers}
        selectedMemberIndex={null}
        onSelectMember={() => {
          /* noop */
        }}
      />
    );

    expect(screen.getByText("Kanto")).toBeInTheDocument();
    expect(screen.getByText("Johto")).toBeInTheDocument();
    expect(screen.getByText("Lorelei")).toBeInTheDocument();
    expect(screen.getByText("Bruno")).toBeInTheDocument();
  });

  it("calls onSelectRegion when a region is clicked", () => {
    const handleRegionSelect = vi.fn();
    render(
      <OpponentSelector
        regions={["Kanto", "Johto"]}
        selectedRegion={null}
        onSelectRegion={handleRegionSelect}
        availableMembers={mockMembers}
        selectedMemberIndex={null}
        onSelectMember={() => {
          /* noop */
        }}
      />
    );

    fireEvent.click(screen.getByText("Johto"));
    expect(handleRegionSelect).toHaveBeenCalledWith("Johto");
  });

  it("calls onSelectMember when a member is clicked", () => {
    const handleMemberSelect = vi.fn();
    render(
      <OpponentSelector
        regions={["Kanto"]}
        selectedRegion="Kanto"
        onSelectRegion={() => {
          /* noop */
        }}
        availableMembers={mockMembers}
        selectedMemberIndex={null}
        onSelectMember={handleMemberSelect}
      />
    );

    // Bruno is index 1
    fireEvent.click(screen.getByText("Bruno"));
    expect(handleMemberSelect).toHaveBeenCalledWith(1);
  });

  it("applies selected styling to active region and member", () => {
    render(
      <OpponentSelector
        regions={["Kanto", "Johto"]}
        selectedRegion="Johto"
        onSelectRegion={() => {
          /* noop */
        }}
        availableMembers={mockMembers}
        selectedMemberIndex={0}
        onSelectMember={() => {
          /* noop */
        }}
      />
    );

    const activeRegion = screen.getByText("Johto");
    expect(activeRegion).toHaveClass("bg-purple-600");

    const activeMember = screen.getByText("Lorelei");
    expect(activeMember).toHaveClass("bg-blue-600");
  });
});
