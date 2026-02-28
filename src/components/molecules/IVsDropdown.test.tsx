import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import IVsDropdown from "./IVsDropdown";

describe("IVsDropdown component", () => {
  const allStats = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
  const selectedStats = ["Atk", "Spe"];

  it("renders the correct number of dropdowns based on selectedIvCount", () => {
    render(
      <IVsDropdown
        ivStats={allStats}
        selectedIvCount={2}
        selectedIvStats={selectedStats}
        setSelectedIvStats={() => {}}
      />
    );
    expect(screen.getByText("Atk")).toBeInTheDocument();
    expect(screen.getByText("Spe")).toBeInTheDocument();
  });

  it("calls setSelectedIvStats when an option is selected", () => {
    const handleSetStats = vi.fn();
    render(
      <IVsDropdown
        ivStats={allStats}
        selectedIvCount={2}
        selectedIvStats={selectedStats} // ["Atk", "Spe"]
        setSelectedIvStats={handleSetStats}
      />
    );

    // Open the first dropdown ("Atk")
    const triggers = screen.getAllByRole("button");
    fireEvent.click(triggers[0]);

    // Click the "HP" option inside the dropdown menu
    const hpOption = screen.getByText("HP").closest("button");
    fireEvent.click(hpOption!);

    expect(handleSetStats).toHaveBeenCalledWith(["HP", "Spe"]);
  });
});
