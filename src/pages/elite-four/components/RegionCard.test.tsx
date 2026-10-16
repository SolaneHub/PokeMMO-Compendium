import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Region } from "@/utils/regionData";

import RegionCard from "./RegionCard";

const mockRegion: Region = {
  id: "kanto",
  name: "Kanto",
  bgColor: "#ff0000",
};

describe("RegionCard component", () => {
  it("renders region name and background color", () => {
    const { container } = render(
      <RegionCard
        region={mockRegion}
        onRegionClick={() => {
          /* noop */
        }}
        isSelected={false}
      />
    );

    expect(screen.getByText("Kanto")).toBeInTheDocument();

    // Check if background color is applied
    const div = container.firstElementChild as HTMLElement;
    expect(div).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" }); // #ff0000 parsed by jsdom
  });

  it("calls onRegionClick when clicked", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <RegionCard
        region={mockRegion}
        onRegionClick={handleClick}
        isSelected={false}
      />
    );

    const div = container.firstElementChild as HTMLElement;
    fireEvent.click(div);
    expect(handleClick).toHaveBeenCalledWith(mockRegion);
  });

  it("applies selected styles when isSelected is true", () => {
    const { container } = render(
      <RegionCard
        region={mockRegion}
        onRegionClick={() => {
          /* noop */
        }}
        isSelected={true}
      />
    );

    const div = container.firstElementChild as HTMLElement;
    expect(div).toHaveClass("scale-105");
  });
});
