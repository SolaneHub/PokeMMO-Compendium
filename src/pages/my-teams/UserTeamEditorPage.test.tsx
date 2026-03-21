import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as ToastContext from "@/context/ToastContext";
import * as TeamEditorHooks from "@/hooks/useTeamEditor";
import { StrategyStep, Team, TeamMember } from "@/types/teams";

import UserTeamEditorPage from "./UserTeamEditorPage";

// Mocking dependencies
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useParams: vi.fn(() => ({})),
  };
});

vi.mock("@/hooks/useTeamEditor");
vi.mock("@/context/ToastContext");

// Mocking organisms/molecules
vi.mock("@/components/organisms/Editor/EditorSidebar", () => ({
  default: ({
    onNavigate,
    onRemoveEnemy,
    onAddEnemy,
  }: {
    onNavigate: (view: string, id?: string | number, context?: string) => void;
    onRemoveEnemy: (member: string, pokemon: string) => void;
    onAddEnemy: (member: { name: string }) => void;
  }) => (
    <div data-testid="sidebar">
      <button onClick={() => onNavigate("roster", 0)}>Go to Pikachu</button>
      <button onClick={() => onNavigate("settings")}>Go to Settings</button>
      <button onClick={() => onNavigate("strategy", "Dewgong", "Lorelei")}>
        Go to Strategy
      </button>
      <button onClick={() => onRemoveEnemy("Lorelei", "Dewgong")}>
        Remove Dewgong
      </button>
      <button onClick={() => onAddEnemy({ name: "Lorelei" })}>
        Add Enemy to Lorelei
      </button>
    </div>
  ),
}));
vi.mock("@/components/organisms/Editor/views/PokemonEditorView", () => ({
  default: ({ onSave }: { onSave: (data: TeamMember) => void }) => (
    <div data-testid="pokemon-editor">
      <button
        onClick={() => onSave({ name: "Raichu" } as unknown as TeamMember)}
      >
        Save Member
      </button>
    </div>
  ),
}));
vi.mock("@/components/organisms/Editor/StrategyEditor", () => ({
  default: ({
    onUpdateSteps,
    selectedEnemyPokemon,
  }: {
    onUpdateSteps: (steps: StrategyStep[]) => void;
    selectedEnemyPokemon: string;
  }) => (
    <div data-testid="strategy-editor">
      <span>Editing {selectedEnemyPokemon}</span>
      <button
        onClick={() =>
          onUpdateSteps([{ id: "1", type: "text", description: "New Step" }])
        }
      >
        Update Strategy
      </button>
    </div>
  ),
}));
vi.mock("@/components/organisms/AddEnemyPokemonModal", () => ({
  default: ({
    onAdd,
    isOpen,
  }: {
    onAdd: (name: string) => void;
    isOpen: boolean;
  }) =>
    isOpen ? (
      <div data-testid="add-enemy-modal">
        <button onClick={() => onAdd("Cloyster")}>Add Cloyster</button>
      </div>
    ) : null,
}));

describe("UserTeamEditorPage", () => {
  const mockTeam: Team = {
    name: "My Pro Team",
    members: [
      { name: "Pikachu" } as unknown as TeamMember,
      null,
      null,
      null,
      null,
      null,
    ],
    enemyPools: { Lorelei: ["Dewgong"] },
    strategies: { Lorelei: { Dewgong: [] } },
  } as unknown as Team;

  const showToastMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ToastContext.useToast).mockReturnValue(showToastMock);
    vi.mocked(TeamEditorHooks.useTeamEditor).mockReturnValue({
      team: mockTeam,
      setTeam: vi.fn(),
      loading: false,
      saving: false,
      saveTeam: vi.fn(),
    } as unknown as TeamEditorHooks.UseTeamEditorReturn);
  });

  it("handles member update correctly", async () => {
    const setTeamMock = vi.fn();
    vi.mocked(TeamEditorHooks.useTeamEditor).mockReturnValue({
      team: mockTeam,
      setTeam: setTeamMock,
      loading: false,
      saving: false,
      saveTeam: vi.fn(),
    } as unknown as TeamEditorHooks.UseTeamEditorReturn);

    render(
      <MemoryRouter>
        <UserTeamEditorPage />
      </MemoryRouter>
    );

    // Navigate to roster slot 0
    fireEvent.click(screen.getByText("Go to Pikachu"));

    // Trigger update member (simulated by save button in mock)
    fireEvent.click(screen.getByText("Save Member"));

    expect(setTeamMock).toHaveBeenCalledWith(
      expect.objectContaining({
        members: expect.arrayContaining([
          expect.objectContaining({ name: "Raichu" }),
        ]),
      })
    );
  });

  it("handles adding new enemy pokemon via modal", async () => {
    const setTeamMock = vi.fn();
    vi.mocked(TeamEditorHooks.useTeamEditor).mockReturnValue({
      team: mockTeam,
      setTeam: setTeamMock,
      loading: false,
      saving: false,
      saveTeam: vi.fn(),
    } as unknown as TeamEditorHooks.UseTeamEditorReturn);

    render(
      <MemoryRouter>
        <UserTeamEditorPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Add Enemy to Lorelei"));
    expect(screen.getByTestId("add-enemy-modal")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("Add Cloyster"));
    });

    expect(setTeamMock).toHaveBeenCalledWith(
      expect.objectContaining({
        enemyPools: expect.objectContaining({
          Lorelei: expect.arrayContaining(["Dewgong", "Cloyster"]),
        }),
      })
    );
  });

  it("handles team name change", async () => {
    const setTeamMock = vi.fn();
    vi.mocked(TeamEditorHooks.useTeamEditor).mockReturnValue({
      team: mockTeam,
      setTeam: setTeamMock,
      loading: false,
      saving: false,
      saveTeam: vi.fn(),
    } as unknown as TeamEditorHooks.UseTeamEditorReturn);

    render(
      <MemoryRouter>
        <UserTeamEditorPage />
      </MemoryRouter>
    );

    const input = screen.getByDisplayValue("My Pro Team");
    fireEvent.change(input, { target: { value: "Updated Name" } });

    expect(setTeamMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Updated Name" })
    );
  });
});
