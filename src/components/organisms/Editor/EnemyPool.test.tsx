import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EliteFourMember } from "@/utils/eliteFourMembers";

import EnemyPool from "./EnemyPool";

const mockMember: EliteFourMember = {
  name: "Lorelei",
  type: "Ice",
  image: "",
  region: "Kanto",
};

describe("EnemyPool component", () => {
  it("renders nothing if no member selected", () => {
    const { container } = render(
      <EnemyPool
        selectedMember={null}
        enemyPool={[]}
        teamStrategies={{}}
        selectedEnemyPokemon={null}
        onSelectEnemy={vi.fn()}
        onAddEnemy={vi.fn()}
        onRemoveEnemy={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders empty state message", () => {
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
      screen.getByText(/Use the 'Add' button to define/)
    ).toBeInTheDocument();
  });

  it("calls onAddEnemy when add button is clicked", () => {
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

  it("renders enemy list and handles interactions", () => {
    const handleSelect = vi.fn();
    const handleRemove = vi.fn();

    const teamStrategies = {
      Lorelei: {
        Lapras: [{} as unknown], // Has strategy
        Dewgong: [], // No strategy
      },
    };

    render(
      <EnemyPool
        selectedMember={mockMember}
        enemyPool={["Lapras", "Dewgong"]}
        teamStrategies={teamStrategies}
        selectedEnemyPokemon="Lapras"
        onSelectEnemy={handleSelect}
        onAddEnemy={vi.fn()}
        onRemoveEnemy={handleRemove}
      />
    );

    expect(screen.getByText("Lapras")).toBeInTheDocument();
    expect(screen.getByText("Dewgong")).toBeInTheDocument();
    expect(screen.getByText("Strategy Active")).toBeInTheDocument();
    expect(screen.getByText("No Strategy")).toBeInTheDocument();

    // Click to select
    const dewyBtn = screen.getByText("Dewgong").closest("button");
    if (dewyBtn) {
      fireEvent.click(dewyBtn);
    }
    expect(handleSelect).toHaveBeenCalledWith("Dewgong");

    // Click remove (it's the second button in the list item div)
    // We can find the buttons and click the one corresponding to Lapras
    const removeButtons = screen.getAllByRole("button", { name: "" }); // Trash icon has no text
    fireEvent.click(removeButtons[0]);
    expect(handleRemove).toHaveBeenCalledWith("Lapras", expect.any(Object));
  });

  it("handles image load error by hiding the image", () => {
    render(
      <EnemyPool
        selectedMember={mockMember}
        enemyPool={["Lapras"]}
        teamStrategies={{}}
        selectedEnemyPokemon={null}
        onSelectEnemy={vi.fn()}
        onAddEnemy={vi.fn()}
        onRemoveEnemy={vi.fn()}
      />
    );

    const img = screen.getByAltText("Lapras");
    fireEvent.error(img);
    expect(img).toHaveStyle({ display: "none" });
  });
});
