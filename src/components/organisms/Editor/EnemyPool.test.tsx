import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EliteFourMember } from "@/utils/eliteFourMembers";
import { PokemonType } from "@/utils/pokemonColors";

import EnemyPool from "./EnemyPool";

const mockMember: EliteFourMember = {
  name: "Lance",
  type: "Dragon" as PokemonType,
  image: "",
  region: "Kanto",
};

describe("EnemyPool component", () => {
  it("renders empty state", () => {
    render(
      <EnemyPool
        selectedMember={mockMember}
        enemyPool={[]}
        teamStrategies={{}}
        selectedEnemyPokemon={null}
        onSelectEnemy={vi.fn()}
        onAddEnemy={vi.fn()}
        onRemoveEnemy={vi.fn()}
      />
    );
    expect(
      screen.getByText(/Use the 'Add' button to define the Pokémon/)
    ).toBeInTheDocument();
  });

  it("renders enemy list and handles selection", () => {
    const handleSelect = vi.fn();
    render(
      <EnemyPool
        selectedMember={mockMember}
        enemyPool={["Dragonite", "Gyarados"]}
        teamStrategies={{}}
        selectedEnemyPokemon={null}
        onSelectEnemy={handleSelect}
        onAddEnemy={vi.fn()}
        onRemoveEnemy={vi.fn()}
      />
    );

    expect(screen.getByText("Dragonite")).toBeInTheDocument();
    expect(screen.getByText("Gyarados")).toBeInTheDocument();

    // Select an enemy
    const btn = screen.getByText("Dragonite").closest("button");
    if (btn) {
      fireEvent.click(btn);
    }
    expect(handleSelect).toHaveBeenCalledWith("Dragonite");
  });

  it("calls onAddEnemy when Add button is clicked", () => {
    const handleAdd = vi.fn();
    render(
      <EnemyPool
        selectedMember={mockMember}
        enemyPool={[]}
        teamStrategies={{}}
        selectedEnemyPokemon={null}
        onSelectEnemy={vi.fn()}
        onAddEnemy={handleAdd}
        onRemoveEnemy={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
