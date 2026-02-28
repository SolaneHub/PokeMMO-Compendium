import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PickupInfoSection from "./PickupInfoSection";

describe("PickupInfoSection component", () => {
  it("renders static information text", () => {
    render(
      <PickupInfoSection
        onOpenModal={() => {
          /* noop */
        }}
      />
    );
    expect(
      screen.getByText(/ability allows a Pokémon to randomly find items/i)
    ).toBeInTheDocument();
  });

  it("calls onOpenModal when button is clicked", () => {
    const handleOpenModal = vi.fn();
    render(<PickupInfoSection onOpenModal={handleOpenModal} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Show Pickup Pokémon" })
    );
    expect(handleOpenModal).toHaveBeenCalledTimes(1);
  });
});
