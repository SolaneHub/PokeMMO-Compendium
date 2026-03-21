import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as MovesContext from "@/context/MovesContext";
import { MoveMaster } from "@/types/pokemon";

import MoveEditorPage from "./MoveEditorPage";

// Mocking dependencies
vi.mock("@/context/MovesContext");
vi.mock("@/firebase/services/movesService");

describe("MoveEditorPage", () => {
  const mockMoves: MoveMaster[] = [
    {
      id: "m1",
      name: "Thunderbolt",
      type: "Electric",
      category: "Special",
      power: "90",
      accuracy: "100",
      pp: "15",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(MovesContext.useMoves).mockReturnValue({
      moves: mockMoves,
      loading: false,
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as MovesContext.MovesContextType);
  });

  it("renders correctly and selects a move", () => {
    render(
      <MemoryRouter>
        <MoveEditorPage />
      </MemoryRouter>
    );

    expect(document.title).toContain("Move Editor");

    const select = screen.getByDisplayValue("-- Create New Move --");
    fireEvent.change(select, { target: { value: "m1" } });

    expect(screen.getByDisplayValue("Thunderbolt")).toBeInTheDocument();
  });

  it("handles new move creation", () => {
    render(
      <MemoryRouter>
        <MoveEditorPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: "Flamethrower" } });

    expect(screen.getByDisplayValue("Flamethrower")).toBeInTheDocument();
  });
});
