import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MyRoster from "./MyRoster";

describe("MyRoster component", () => {
  const members = [
    { name: "Pikachu", item: "Light Ball", dexId: 25 },
    { name: "MissingNo" }, // No dexId to test fallback
    null,
    null,
  ];

  it("renders correct number of slots", () => {
    render(<MyRoster members={members} onEditSlot={vi.fn()} />);
    const slots = screen.getAllByRole("button");
    expect(slots).toHaveLength(4);
  });

  it("calls onEditSlot when a slot is clicked or keyboard triggered", () => {
    const handleEdit = vi.fn();
    render(<MyRoster members={members} onEditSlot={handleEdit} />);

    const slots = screen.getAllByRole("button");

    // Click first slot
    fireEvent.click(slots[0]);
    expect(handleEdit).toHaveBeenCalledWith(0);

    // Keyboard Enter on second slot
    fireEvent.keyDown(slots[1], { key: "Enter", code: "Enter" });
    expect(handleEdit).toHaveBeenCalledWith(1);

    // Keyboard Space on third slot
    fireEvent.keyDown(slots[2], { key: " ", code: "Space" });
    expect(handleEdit).toHaveBeenCalledWith(2);

    // Random key shouldn't trigger
    fireEvent.keyDown(slots[3], { key: "A", code: "KeyA" });
    expect(handleEdit).toHaveBeenCalledTimes(3); // Unchanged
  });

  it("handles image load errors and sets correct fallback src", () => {
    render(<MyRoster members={members} onEditSlot={vi.fn()} />);

    const pikaImg = screen.getByAltText("Pikachu");
    const missingImg = screen.getByAltText("MissingNo");

    fireEvent.error(pikaImg);
    fireEvent.error(missingImg);

    expect(pikaImg).toHaveAttribute(
      "src",
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
    );
    expect(missingImg).toHaveAttribute(
      "src",
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
    );
  });

  it("renders empty slots", () => {
    const { container } = render(
      <MyRoster members={[null]} onEditSlot={vi.fn()} />
    );
    // The lucide-react Plus icon renders an SVG
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
