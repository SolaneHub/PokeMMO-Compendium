import { fireEvent, render, screen } from "@testing-library/react";
import { User } from "firebase/auth";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import * as AuthContext from "@/context/AuthContext";

import Sidebar from "./Sidebar";

describe("Sidebar component", () => {
  it("renders navigation links for a guest user", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      currentUser: null,
      isAdmin: false,
      logout: vi.fn(),
    } as unknown as ReturnType<typeof AuthContext.useAuth>);

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} setIsOpen={vi.fn()} />
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
      currentUser: { email: "test@example.com" } as unknown as User,
      isAdmin: false,
      logout: vi.fn(),
    } as unknown as ReturnType<typeof AuthContext.useAuth>);

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} setIsOpen={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("My Teams")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });

  it("renders admin links when user is admin", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      currentUser: { email: "admin@example.com" } as unknown as User,
      isAdmin: true,
      logout: vi.fn(),
    } as unknown as ReturnType<typeof AuthContext.useAuth>);

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} setIsOpen={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", () => {
    const mockLogout = vi.fn();
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      currentUser: { email: "test@example.com" } as unknown as User,
      isAdmin: false,
      logout: mockLogout,
    } as unknown as ReturnType<typeof AuthContext.useAuth>);

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} setIsOpen={vi.fn()} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
