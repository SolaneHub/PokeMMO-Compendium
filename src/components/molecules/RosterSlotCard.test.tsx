import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RosterSlotCard from "./RosterSlotCard";

describe("RosterSlotCard component", () => {
  it("renders empty state correctly", () => {
    render(<RosterSlotCard idx={0} member={null} onClick={() => {}} />);
    expect(screen.getByText("Slot 01")).toBeInTheDocument();
    expect(screen.getByText("Empty Slot")).toBeInTheDocument();
    expect(screen.getByText("+ Click to Configure")).toBeInTheDocument();
  });

  it("renders member data if provided", () => {
    render(
      <RosterSlotCard
        idx={1}
        member={{ name: "Garchomp", item: "Choice Scarf", nature: "Jolly" }}
        onClick={() => {}}
      />
    );
    expect(screen.getByText("Slot 02")).toBeInTheDocument();
    expect(screen.getByText("Garchomp")).toBeInTheDocument();
    expect(screen.getByText("Choice Scarf")).toBeInTheDocument();
    expect(screen.getByText("Jolly")).toBeInTheDocument();
  });

  it("handles missing item or nature for an existing member", () => {
    render(
      <RosterSlotCard idx={2} member={{ name: "Snorlax" }} onClick={() => {}} />
    );
    expect(screen.getByText("Snorlax")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument(); // Default item
    expect(screen.getByText("Neutral")).toBeInTheDocument(); // Default nature
  });

  it("calls onClick when card is clicked", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <RosterSlotCard idx={0} member={null} onClick={handleClick} />
    );

    const div = container.firstElementChild as HTMLElement;
    fireEvent.click(div);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
