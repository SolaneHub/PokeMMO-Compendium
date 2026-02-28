import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ViewTeamBuildButton from "./ViewTeamBuildButton";

describe("ViewTeamBuildButton component", () => {
  it("renders button with correct team name", () => {
    render(
      <ViewTeamBuildButton
        selectedTeam="Alpha"
        onOpen={() => {
          /* noop */
        }}
      />
    );
    expect(screen.getByText("📋 View Alpha Team Build")).toBeInTheDocument();
  });

  it("calls onOpen when clicked", () => {
    const handleOpen = vi.fn();
    render(<ViewTeamBuildButton selectedTeam="Alpha" onOpen={handleOpen} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleOpen).toHaveBeenCalledTimes(1);
  });
});
