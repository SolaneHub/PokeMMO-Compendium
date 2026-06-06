import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import BreedingPage from "./BreedingPage";

// Mocking dependencies
vi.mock("@/utils/usePersistentState", () => ({
  usePersistentState: vi.fn((key, initial) => [initial, vi.fn()]),
}));

// Mocking child components to simplify
vi.mock("@/pages/breeding/components/IVsSelector", () => ({
  default: () => <div data-testid="ivs-selector" />,
}));
vi.mock("@/pages/breeding/components/IVsDropdown", () => ({
  default: () => <div data-testid="ivs-dropdown" />,
}));
vi.mock("@/pages/breeding/components/TreeScheme", () => ({
  default: () => <div data-testid="tree-scheme" />,
}));

describe("BreedingPage", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <BreedingPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Breeding Planner")).toBeInTheDocument();
    expect(screen.getByTestId("ivs-selector")).toBeInTheDocument();
    expect(screen.getByTestId("ivs-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("tree-scheme")).toBeInTheDocument();
  });
});
