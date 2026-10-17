import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { usePokemonUI } from "@/hooks/usePokemonUI";
import { createMockPokemon } from "@/test/factories";

describe("usePokemonUI", () => {
  it("restituisce i valori di default con null o undefined", () => {
    const { result: nullResult } = renderHook(() => usePokemonUI(null));
    expect(nullResult.current).toEqual({
      sprite: null,
      background: "#1a1b20",
      shadow: "none",
    });

    const { result: undefinedResult } = renderHook(() =>
      usePokemonUI(undefined)
    );
    expect(undefinedResult.current).toEqual({
      sprite: null,
      background: "#1a1b20",
      shadow: "none",
    });
  });

  it("restituisce sprite, background e shadow validi per Pokémon mono-tipo", () => {
    const pokemon = createMockPokemon({
      name: "Pikachu",
      types: ["Electric"],
    });

    const { result } = renderHook(() => usePokemonUI(pokemon));

    expect(typeof result.current.sprite).toBe("string");
    expect(result.current.sprite).not.toBe("");
    expect(result.current.background).toBeTruthy();
    expect(result.current.shadow).toBeTruthy();
    expect(result.current.shadow).not.toBe("none");
  });

  it("restituisce un background con linear-gradient e dual shadow per Pokémon a doppio tipo", () => {
    const pokemon = createMockPokemon({
      name: "Charizard",
      types: ["Fire", "Flying"],
    });

    const { result } = renderHook(() => usePokemonUI(pokemon));

    expect(typeof result.current.sprite).toBe("string");
    expect(result.current.sprite).not.toBe("");
    expect(result.current.background).toContain("linear-gradient");
    // Dual shadow contiene due ombre separate da virgola
    expect(result.current.shadow).toContain(",");
    expect(result.current.shadow.split(",")).toHaveLength(2);
  });
});
