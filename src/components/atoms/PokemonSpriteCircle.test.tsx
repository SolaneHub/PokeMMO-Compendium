import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PokemonSpriteCircle from "./PokemonSpriteCircle";

describe("PokemonSpriteCircle component", () => {
  it("renders the fallback '?' when no spriteUrl and no pokemonName are provided", () => {
    render(<PokemonSpriteCircle spriteUrl={null} pokemonName={null} />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("renders an image when spriteUrl is provided", () => {
    const testUrl = "https://example.com/sprite.png";
    render(<PokemonSpriteCircle spriteUrl={testUrl} pokemonName="Pikachu" />);
    const img = screen.getByRole("img", { name: "Pikachu" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", testUrl);
  });

  it("generates an image url from pokemonName when spriteUrl is absent", () => {
    // The actual URL relies on getSpriteUrlByName which maps to ID (Bulbasaur -> 1.svg)
    render(<PokemonSpriteCircle spriteUrl={null} pokemonName="Bulbasaur" />);
    const img = screen.getByRole("img", { name: "Bulbasaur" });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toContain("1.svg");
  });
});
