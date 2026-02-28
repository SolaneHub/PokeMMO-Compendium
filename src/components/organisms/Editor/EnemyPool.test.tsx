import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import EnemyPool from "./EnemyPool";

const mockMember = {
  id: "lance",
  name: "Lance",
  type: "Dragon",
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
        onSelectEnemy={() => {}}
        onAddEnemy={() => {}}
        onRemoveEnemy={() => {}}
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
        onAddEnemy={() => {}}
        onRemoveEnemy={() => {}}
      />
    );

    expect(screen.getByText("Dragonite")).toBeInTheDocument();
    expect(screen.getByText("Gyarados")).toBeInTheDocument();

    // Select an enemy
    fireEvent.click(screen.getByText("Dragonite").closest("button")!);
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
        onSelectEnemy={() => {}}
        onAddEnemy={handleAdd}
        onRemoveEnemy={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
