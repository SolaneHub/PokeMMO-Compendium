import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import IVsSelector from "./IVsSelector";

describe("IVsSelector component", () => {
  it("renders the IV count selector and nature toggle", () => {
    render(
      <IVsSelector
        ivOptions={[2, 3, 4]}
        selectedIvCount={3}
        setSelectedIvCount={() => {
          /* noop */
        }}
        nature={true}
        setNature={() => {
          /* noop */
        }}
      />
    );

    expect(screen.getByText("Desired Perfect IVs")).toBeInTheDocument();
    expect(screen.getByText("Nature Breeding")).toBeInTheDocument();
    expect(screen.getByText("Include nature in path")).toBeInTheDocument();
  });

  it("calls setNature when the toggle is clicked", () => {
    const handleSetNature = vi.fn();
    render(
      <IVsSelector
        ivOptions={[2, 3, 4]}
        selectedIvCount={3}
        setSelectedIvCount={() => {
          /* noop */
        }}
        nature={false}
        setNature={handleSetNature}
      />
    );

    const toggleTitle = screen.getByText("Nature Breeding");
    const container = toggleTitle.closest("div.cursor-pointer");
    if (container) {
      fireEvent.click(container);
    }

    expect(handleSetNature).toHaveBeenCalledWith(true);
  });
});
