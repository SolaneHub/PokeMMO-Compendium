import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PokemonEditorModal from "./PokemonEditorModal";

vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: () => ({
    pokemonNames: ["Pikachu", "Charizard"],
    itemNames: ["Light Ball"],
    abilityNames: ["Static"],
    allPokemonData: [{ name: "Pikachu", id: 25 }],
  }),
}));

vi.mock("@/context/MovesContext", () => ({
  useMoves: () => ({
    moves: [{ name: "Thunderbolt" }, { name: "Quick Attack" }],
  }),
}));

// Better mock for useActionState to actually trigger the callback for testing the save logic
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useActionState: (
      submitFn: (state: unknown, formData: FormData) => Promise<unknown>,
      initialState: unknown
    ) => {
      const [state, setState] = actual.useState(initialState);
      const dispatch = async (formData: FormData) => {
        const result = await submitFn(state, formData);
        if (result) setState(result);
      };

      // Expose dispatch on window for easy testing
      (
        window as unknown as { __testSubmitPokemonForm: unknown }
      ).__testSubmitPokemonForm = dispatch;

      return [state, dispatch, false];
    },
  };
});

// Mock utility for dex ID
vi.mock("@/utils/pokedexDataExtraction", () => ({
  getPokemonIdByName: (name: string) => (name === "Pikachu" ? 25 : null),
}));

describe("PokemonEditorModal component", () => {
  const initialData = {
    name: "Pikachu",
    item: "Light Ball",
    ability: "Static",
    nature: "Timid",
    evs: "",
    ivs: "",
    moves: ["Thunderbolt"],
  };

  it("renders null if not open", () => {
    const { container } = render(
      <PokemonEditorModal
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders Add Pokemon header and handles empty initial data", () => {
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={null}
      />
    );
    expect(screen.getByText("Add Pokémon")).toBeInTheDocument();
  });

  it("renders Edit Pokemon header and populates fields when initialData is provided", () => {
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={initialData}
      />
    );
    expect(screen.getByText("Edit Pokémon")).toBeInTheDocument();
    const nameInput = screen.getByPlaceholderText(
      "e.g. Garchomp"
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("Pikachu");
  });

  it("calls onClose when Cancel is clicked or background is clicked", () => {
    const handleClose = vi.fn();
    const { container } = render(
      <PokemonEditorModal
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        initialData={null}
      />
    );

    // Cancel Button
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Overlay click
    const overlay = container.firstElementChild as HTMLElement;
    fireEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(2);

    // Prevent propagation on modal content
    fireEvent.click(overlay.firstElementChild as HTMLElement);
    expect(handleClose).toHaveBeenCalledTimes(2); // Should not increase
  });

  it("handles form field changes", () => {
    const { container } = render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={initialData}
      />
    );

    // Name
    const nameInput = container.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Charizard" } });
    expect(nameInput.value).toBe("Charizard");

    // Item
    const itemInput = container.querySelector(
      'input[name="item"]'
    ) as HTMLInputElement;
    fireEvent.change(itemInput, { target: { value: "Charcoal" } });
    expect(itemInput.value).toBe("Charcoal");

    // Ability
    const abilityField = container.querySelector(
      'input[name="ability"]'
    ) as HTMLInputElement;
    fireEvent.change(abilityField, { target: { value: "Blaze" } });
    expect(abilityField.value).toBe("Blaze");

    // Nature
    const natureField = container.querySelector(
      'input[name="nature"]'
    ) as HTMLInputElement;
    fireEvent.change(natureField, { target: { value: "Jolly" } });
    expect(natureField.value).toBe("Jolly");

    // EVs
    const evsField = container.querySelector(
      'input[name="evs"]'
    ) as HTMLInputElement;
    fireEvent.change(evsField, { target: { value: "252 Atk" } });
    expect(evsField.value).toBe("252 Atk");

    // IVs
    const ivsField = container.querySelector(
      'input[name="ivs"]'
    ) as HTMLInputElement;
    fireEvent.change(ivsField, { target: { value: "6x31" } });
    expect(ivsField.value).toBe("6x31");

    // Moves
    const moveInputs = screen.getAllByPlaceholderText("Select move...");
    fireEvent.change(moveInputs[0], { target: { value: "Flamethrower" } });
    expect((moveInputs[0] as HTMLInputElement).value).toBe("Flamethrower");
  });

  it("handles form submission with valid data", async () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        initialData={initialData}
      />
    );

    const form = document.getElementById("pokemon-form") as HTMLFormElement;

    await act(async () => {
      const formData = new FormData(form);
      formData.set("name", "Pikachu");
      formData.set("item", "Light Ball");
      // We manually override one move to test empty move filtering
      formData.set("move1", "   ");
      await (
        window as unknown as {
          __testSubmitPokemonForm: (fd: FormData) => Promise<void>;
        }
      ).__testSubmitPokemonForm(formData);
    });

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Pikachu",
        item: "Light Ball",
        moves: ["Thunderbolt"], // move1 was blank and should be filtered out
        dexId: 25,
      })
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("shows error if form is submitted without a name", async () => {
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={{ ...initialData, name: "" }}
      />
    );

    const form = document.getElementById("pokemon-form") as HTMLFormElement;

    await act(async () => {
      const formData = new FormData(form);
      formData.set("name", "   "); // Empty string or spaces
      await (
        window as unknown as {
          __testSubmitPokemonForm: (fd: FormData) => Promise<void>;
        }
      ).__testSubmitPokemonForm(formData);
    });

    // Error message should appear in document
    expect(screen.getByText("Pokémon name is required")).toBeInTheDocument();
  });

  it("updates local state when initialData prop changes (React 19 derived state pattern)", () => {
    const { rerender } = render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={null}
      />
    );

    const nameInput = screen.getByPlaceholderText(
      "e.g. Garchomp"
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("");

    // Rerender with new data
    rerender(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={initialData}
      />
    );

    // State should have updated based on prop change
    expect(nameInput.value).toBe("Pikachu");
  });
});
