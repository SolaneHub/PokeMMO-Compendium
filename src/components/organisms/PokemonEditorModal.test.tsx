import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PokemonEditorModal from "./PokemonEditorModal";

vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: () => ({
    pokemonNames: ["Pikachu"],
    itemNames: ["Light Ball"],
    abilityNames: ["Static"],
    allPokemonData: [],
  }),
}));

vi.mock("@/context/MovesContext", () => ({
  useMoves: () => ({
    moves: [{ name: "Thunderbolt" }],
  }),
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useActionState: vi.fn((submitFn, initialState) => {
      return [initialState, submitFn, false];
    }),
  };
});

describe("PokemonEditorModal component", () => {
  it("renders null if not open", () => {
    const { container } = render(
      <PokemonEditorModal
        isOpen={false}
        onClose={() => {
          /* noop */
        }}
        onSave={() => {
          /* noop */
        }}
        initialData={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders Add Pokemon header when initialData is null", () => {
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={() => {
          /* noop */
        }}
        onSave={() => {
          /* noop */
        }}
        initialData={null}
      />
    );
    expect(screen.getByText("Add Pokémon")).toBeInTheDocument();
  });

  it("renders Edit Pokemon header and populates fields when initialData is provided", () => {
    const initialData = {
      name: "Pikachu",
      item: "Light Ball",
      ability: "Static",
      nature: "Timid",
      evs: "",
      ivs: "",
      moves: ["Thunderbolt"],
    };

    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={() => {
          /* noop */
        }}
        onSave={() => {
          /* noop */
        }}
        initialData={initialData}
      />
    );

    expect(screen.getByText("Edit Pokémon")).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(
      "e.g. Garchomp"
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("Pikachu");
  });

  it("calls onClose when Cancel is clicked", () => {
    const handleClose = vi.fn();
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={handleClose}
        onSave={() => {
          /* noop */
        }}
        initialData={null}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
