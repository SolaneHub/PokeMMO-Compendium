import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as AuthContext from "@/context/AuthContext";

import ProtectedRoute from "./ProtectedRoute";

// Mocking Navigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div data-testid="navigate" data-to={to} />),
  };
});

// Mocking useAuth
vi.mock("@/context/AuthContext");

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: true,
    } as unknown as ReturnType<typeof AuthContext.useAuth>);

    render(<ProtectedRoute>Content</ProtectedRoute>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to login if not authenticated", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      currentUser: null,
    } as unknown as ReturnType<typeof AuthContext.useAuth>);

    render(
      <MemoryRouter>
        <ProtectedRoute>Content</ProtectedRoute>
      </MemoryRouter>
    );
    const navigate = screen.getByTestId("navigate");
    expect(navigate).toHaveAttribute("data-to", "/login");
  });

  it("redirects to home if adminOnly and user is not admin", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      currentUser: { uid: "123" },
      isAdmin: false,
    } as unknown as ReturnType<typeof AuthContext.useAuth>);

    render(
      <MemoryRouter>
        <ProtectedRoute adminOnly>Content</ProtectedRoute>
      </MemoryRouter>
    );
    const navigate = screen.getByTestId("navigate");
    expect(navigate).toHaveAttribute("data-to", "/");
  });

  it("renders children if authenticated and (not adminOnly or user is admin)", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      currentUser: { uid: "123" },
      isAdmin: true,
    } as unknown as ReturnType<typeof AuthContext.useAuth>);

    render(
      <MemoryRouter>
        <ProtectedRoute adminOnly>
          <div data-testid="content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
});
