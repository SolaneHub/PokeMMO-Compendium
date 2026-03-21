import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PokemonCard from "./PokemonCard";

describe("PokemonCard", () => {
  const defaultProps = {
    pokemonName: "Pikachu",
    pokemonImageSrc: "pikachu.png",
    nameBackground: "bg-yellow-400",
    onClick: vi.fn(),
    isSelected: false,
  };

  it("renders correctly", () => {
    render(<PokemonCard {...defaultProps} />);
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "pikachu.png");
  });

  it("calls onClick when clicked", () => {
    render(<PokemonCard {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it("applies selected classes", () => {
    render(<PokemonCard {...defaultProps} isSelected={true} />);
    const btn = screen.getByRole("button");
    // Verifichiamo che contenga la classe di scale che indica la selezione
    expect(btn.className).toContain("scale-105");
  });
});
