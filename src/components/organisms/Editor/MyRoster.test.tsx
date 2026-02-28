import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MyRoster from "./MyRoster";

describe("MyRoster component", () => {
  it("renders empty slots", () => {
    const members = [null, null, null, null, null, null];
    render(<MyRoster members={members} onEditSlot={() => {}} />);

    // There are 6 slots, each should be a button role element
    const slots = screen.getAllByRole("button");
    expect(slots.length).toBe(6);
    // Since there are no members, images shouldn't be rendered
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders member images when present", () => {
    const members = [{ name: "Pikachu", item: "Light Ball" }, null, null];
    render(<MyRoster members={members} onEditSlot={() => {}} />);

    const img = screen.getByAltText("Pikachu");
    expect(img).toBeInTheDocument();
  });

  it("calls onEditSlot with correct index when clicked", () => {
    const handleEdit = vi.fn();
    const members = [null, { name: "Bulbasaur" }, null];
    render(<MyRoster members={members} onEditSlot={handleEdit} />);

    const slots = screen.getAllByRole("button");
    // Click the second slot
    fireEvent.click(slots[1]);
    expect(handleEdit).toHaveBeenCalledWith(1);
  });

  it("handles keyboard events", () => {
    const handleEdit = vi.fn();
    const members = [null, null, null];
    render(<MyRoster members={members} onEditSlot={handleEdit} />);

    const slots = screen.getAllByRole("button");

    // Press Space
    fireEvent.keyDown(slots[0], { key: " ", code: "Space" });
    expect(handleEdit).toHaveBeenCalledWith(0);

    // Press Enter
    fireEvent.keyDown(slots[2], { key: "Enter", code: "Enter" });
    expect(handleEdit).toHaveBeenCalledWith(2);
  });
});
