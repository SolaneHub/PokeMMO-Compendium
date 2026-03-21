import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as AuthContext from "@/context/AuthContext";
import * as ToastContext from "@/context/ToastContext";

import AuthPage from "./AuthPage";

// Mocking dependencies
vi.mock("@/context/AuthContext");
vi.mock("@/context/ToastContext");

// Mocking useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mocking firebase/app partially to keep initializeApp but stub FirebaseError
vi.mock("firebase/app", async (importOriginal) => {
  const actual = await importOriginal<object>();
  return {
    ...actual,
    FirebaseError: class extends Error {
      code: string;
      constructor(code: string, message: string) {
        super(message);
        this.code = code;
      }
    },
  };
});

describe("AuthPage", () => {
  const showToastMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ToastContext.useToast).mockReturnValue(showToastMock);
  });

  it("shows loading state", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: true,
    } as unknown as AuthContext.AuthContextType);
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      );
    });
    expect(screen.getByText(/Please wait.../i)).toBeInTheDocument();
  });

  it("renders sign in state correctly", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      currentUser: null,
    } as unknown as AuthContext.AuthContextType);

    await act(async () => {
      render(
        <MemoryRouter>
          <AuthPage isSignup={false} />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();
  });

  it("calls googleSignIn when button clicked", async () => {
    const signInMock = vi.fn().mockResolvedValue(undefined);
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      currentUser: null,
      googleSignIn: signInMock,
    } as unknown as AuthContext.AuthContextType);

    await act(async () => {
      render(
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      );
    });

    const btn = screen.getByText(/Continue with Google/i);
    fireEvent.click(btn);

    expect(signInMock).toHaveBeenCalled();
  });

  it("redirects if already logged in as admin", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      currentUser: { uid: "admin123" },
      isAdmin: true,
    } as unknown as AuthContext.AuthContextType);

    await act(async () => {
      render(
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard");
  });

  it("redirects if already logged in as user", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      currentUser: { uid: "user123" },
      isAdmin: false,
    } as unknown as AuthContext.AuthContextType);

    await act(async () => {
      render(
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/my-teams");
  });
});
