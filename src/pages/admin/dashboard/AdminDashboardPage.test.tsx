import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as AuthContext from "@/context/AuthContext";
import * as ToastContext from "@/context/ToastContext";
import * as MovesService from "@/firebase/services/movesService";
import * as MigrationUtils from "@/utils/migrationUtils";

import AdminDashboardPage from "./AdminDashboardPage";

// Mocking dependencies
vi.mock("@/context/AuthContext");
vi.mock("@/context/ToastContext");
vi.mock("@/firebase/services/movesService");
vi.mock("@/utils/migrationUtils");
vi.mock("@/components/organisms/AdminTeamList", () => ({
  default: () => <div data-testid="admin-team-list" />,
}));

describe("AdminDashboardPage", () => {
  const showToastMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ToastContext.useToast).mockReturnValue(showToastMock);
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );
    vi.spyOn(console, "error").mockImplementation(vi.fn());
  });

  it("shows loading state", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: true,
    } as unknown as AuthContext.AuthContextType);
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles move synchronization and errors", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
    } as unknown as AuthContext.AuthContextType);
    vi.mocked(MovesService.importMovesFromPokedex).mockRejectedValue(
      new Error("Sync Error")
    );

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("System"));
    fireEvent.click(screen.getByText("Sync Now"));

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith(
        "Error importing moves.",
        "error"
      );
    });
  });

  it("handles database cleanup button", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
    } as unknown as AuthContext.AuthContextType);

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("System"));
    fireEvent.click(screen.getByText("Clean Up"));

    expect(MigrationUtils.cleanupPokedexImages).toHaveBeenCalled();
  });
});
