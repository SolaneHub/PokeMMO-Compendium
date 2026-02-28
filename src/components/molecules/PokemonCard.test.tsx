import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PokemonCard from "./PokemonCard";

describe("PokemonCard component", () => {
  it("renders pokemon name and image", () => {
    render(
      <PokemonCard pokemonName="Pikachu" pokemonImageSrc="/pikachu.png" />
    );
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    const img = screen.getByAltText("Pikachu");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/pikachu.png");
  });

  it("renders a fallback placeholder if no image source is provided", () => {
    render(<PokemonCard pokemonName="Unknown" />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemonName="Pikachu" onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard events for accessibility", () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemonName="Pikachu" onClick={handleClick} />);

    const card = screen.getByRole("button");

    // Pressing Enter should trigger click
    fireEvent.keyDown(card, { key: "Enter", code: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Pressing Space should also trigger click
    fireEvent.keyDown(card, { key: " ", code: "Space" });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("applies selected styles when isSelected is true", () => {
    render(
      <PokemonCard
        pokemonName="Pikachu"
        isSelected={true}
        nameBackground="red"
      />
    );
    const card = screen.getByRole("button");
    expect(card).toHaveClass("scale-105");
    const styleAttr = card.getAttribute("style");
    expect(styleAttr).toContain("border-color: red");
  });
});
