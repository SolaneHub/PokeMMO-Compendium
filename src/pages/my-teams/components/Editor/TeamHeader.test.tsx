import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import TeamHeader from "./TeamHeader";

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("TeamHeader component", () => {
  it("renders team name and type", () => {
    render(
      <MemoryRouter>
        <TeamHeader
          teamName="Alpha Squad"
          teamType="Gym Rerun"
          onSave={() => {
            /* noop */
          }}
          saving={false}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Alpha Squad")).toBeInTheDocument();
    expect(screen.getByText("Gym Rerun")).toBeInTheDocument();
  });

  it("calls onSave when save button is clicked", () => {
    const handleSave = vi.fn();
    render(
      <MemoryRouter>
        <TeamHeader teamName="Alpha Squad" onSave={handleSave} saving={false} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Save Team/i }));
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it("disables save button when saving is true", () => {
    render(
      <MemoryRouter>
        <TeamHeader
          teamName="Alpha Squad"
          onSave={() => {
            /* noop */
          }}
          saving={true}
        />
      </MemoryRouter>
    );

    const saveBtn = screen.getByRole("button", { name: /Saving.../i });
    expect(saveBtn).toBeDisabled();
  });

  it("navigates back when arrow button is clicked", () => {
    render(
      <MemoryRouter>
        <TeamHeader
          teamName="Alpha Squad"
          onSave={() => {
            /* noop */
          }}
          saving={false}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Go back to my teams" })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/my-teams");
  });
});
