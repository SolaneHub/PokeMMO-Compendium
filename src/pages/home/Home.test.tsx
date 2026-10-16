import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as AuthContext from "@/context/AuthContext";
import { createMockAppUser, createMockAuthContext } from "@/test/factories";

import Home from "./Home";

// Mocking dependencies
vi.mock("@/context/AuthContext");
vi.mock("@/pages/home/components/HomeHero", () => ({
  default: () => <div>Hero</div>,
}));
vi.mock("@/pages/home/components/HomeFooter", () => ({
  default: () => <div>Footer</div>,
}));

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders features when user is not logged in", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(
      createMockAuthContext({ currentUser: null, isAdmin: false })
    );

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Hero")).toBeInTheDocument();
    expect(screen.getByText("Tools & Guides")).toBeInTheDocument();
    expect(
      screen.getByText(/Log in to create, save and manage/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders features when user is logged in", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(
      createMockAuthContext({
        currentUser: createMockAppUser({ email: "user@test.com" }),
      })
    );

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.queryByText(/Log in to create, save and manage/i)
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/Build, save and manage your own competitive teams/i)
    ).toBeInTheDocument();
  });
});
