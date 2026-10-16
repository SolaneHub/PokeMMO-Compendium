import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as AuthContext from "@/context/AuthContext";
import * as ConfirmationContext from "@/context/ConfirmationContext";
import * as ToastContext from "@/context/ToastContext";
import * as MovesService from "@/firebase/services/movesService";
import { createMockAppUser, createMockAuthContext } from "@/test/factories";

import AdminDashboardPage from "./AdminDashboardPage";

// Mocking dependencies
vi.mock("@/context/AuthContext");
vi.mock("@/context/ConfirmationContext");
vi.mock("@/context/ToastContext");
vi.mock("@/firebase/services/movesService");
vi.mock("@/pages/admin/components/AdminTeamList", () => ({
  default: () => <div data-testid="admin-team-list" />,
}));

describe("AdminDashboardPage", () => {
  const showToastMock = vi.fn();
  const confirmMock = vi.fn().mockResolvedValue(true);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ToastContext.useToast).mockReturnValue(showToastMock);
    vi.mocked(ConfirmationContext.useConfirm).mockReturnValue(confirmMock);
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );
    vi.spyOn(console, "error").mockImplementation(vi.fn());
  });

  it("shows loading state", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(
      createMockAuthContext({ loading: true })
    );
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles move synchronization and errors", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(
      createMockAuthContext({
        loading: false,
        currentUser: createMockAppUser({ email: "admin@test.com" }),
        isAdmin: true,
      })
    );
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

  it("displays database migrations information", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(
      createMockAuthContext({
        loading: false,
        currentUser: createMockAppUser({ email: "admin@test.com" }),
        isAdmin: true,
      })
    );

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("System"));

    expect(screen.getByText("Database Migrations")).toBeInTheDocument();
    expect(
      screen.getByText(/scripts\/migrations\/migrate\.ts/)
    ).toBeInTheDocument();
  });
});
