import { describe, expect, it } from "vitest";

import { getPokemonDocId, POKEDEX_COLLECTION } from "./common";

describe("firebase/common", () => {
  it("exports POKEDEX_COLLECTION correctly", () => {
    expect(POKEDEX_COLLECTION).toBe("pokedex");
  });

  describe("getPokemonDocId", () => {
    it("returns stringified lowercase ID when passed a string number", () => {
      expect(getPokemonDocId("001")).toBe("001");
      expect(getPokemonDocId("25")).toBe("025");
    });

    it("returns stringified number when passed a number", () => {
      expect(getPokemonDocId(1)).toBe("001");
      expect(getPokemonDocId(150)).toBe("150");
    });

    it("returns string as is when passed a name", () => {
      expect(getPokemonDocId("Bulbasaur")).toBe("Bulbasaur");
      expect(getPokemonDocId("Mr. Mime")).toBe("Mr. Mime");
    });
  });
});
