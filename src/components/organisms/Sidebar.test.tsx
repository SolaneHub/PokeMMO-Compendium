import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import Sidebar from "./Sidebar";
import * as AuthContext from "@/context/AuthContext";

describe("Sidebar component", () => {
  it("renders navigation links for a guest user", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      currentUser: null,
      isAdmin: false,
      logout: vi.fn(),
    } as any);

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} setIsOpen={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Pokédex")).toBeInTheDocument();
    expect(screen.getByText("Guest")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("My Teams")).not.toBeInTheDocument();
  });

  it("renders user-specific links when logged in", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      currentUser: { email: "test@example.com" },
      isAdmin: false,
      logout: vi.fn(),
    } as any);

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} setIsOpen={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("My Teams")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });

  it("renders admin links when user is admin", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      currentUser: { email: "admin@example.com" },
      isAdmin: true,
      logout: vi.fn(),
    } as any);

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} setIsOpen={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", () => {
    const mockLogout = vi.fn();
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      currentUser: { email: "test@example.com" },
      isAdmin: false,
      logout: mockLogout,
    } as any);

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} setIsOpen={() => {}} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
