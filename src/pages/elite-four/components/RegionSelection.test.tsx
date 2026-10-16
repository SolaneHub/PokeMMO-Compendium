import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RegionSelection from "./RegionSelection";

describe("RegionSelection component", () => {
  it("renders the title", () => {
    render(
      <RegionSelection
        selectedRegion={null}
        onRegionClick={() => {
          /* noop */
        }}
      />
    );
    expect(screen.getByText("Select Region")).toBeInTheDocument();
  });

  it("renders all regions", () => {
    render(
      <RegionSelection
        selectedRegion={null}
        onRegionClick={() => {
          /* noop */
        }}
      />
    );
    expect(screen.getByText("Kanto")).toBeInTheDocument();
    expect(screen.getByText("Hoenn")).toBeInTheDocument();
    expect(screen.getByText("Unova")).toBeInTheDocument();
  });

  it("calls onRegionClick when a region is clicked", () => {
    const handleRegionClick = vi.fn();
    render(
      <RegionSelection
        selectedRegion={null}
        onRegionClick={handleRegionClick}
      />
    );

    fireEvent.click(screen.getByText("Kanto"));
    expect(handleRegionClick).toHaveBeenCalledWith("Kanto");
  });
});
