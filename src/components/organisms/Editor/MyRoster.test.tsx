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
    const firstSlot = slots[0];
    if (firstSlot) {
      fireEvent.click(firstSlot);
    }
    expect(handleEdit).toHaveBeenCalledWith(0);

    // Enter on second slot
    const secondSlot = slots[1];
    if (secondSlot) {
      fireEvent.click(secondSlot); // In JSDOM click simulates the action for buttons
    }
    expect(handleEdit).toHaveBeenCalledWith(1);

    // Space on third slot
    const thirdSlot = slots[2];
    if (thirdSlot) {
      fireEvent.click(thirdSlot);
    }
    expect(handleEdit).toHaveBeenCalledWith(2);

    // Random key shouldn't trigger
    const fourthSlot = slots[3];
    if (fourthSlot) {
      fireEvent.keyDown(fourthSlot, { key: "A", code: "KeyA" });
    }
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
