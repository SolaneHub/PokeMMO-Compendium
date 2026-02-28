import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GoogleSignInButton from "./GoogleSignInButton";

describe("GoogleSignInButton component", () => {
  it("renders with correct text and icon", () => {
    render(<GoogleSignInButton onClick={() => {}} />);
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(document.querySelector("svg")).toBeInTheDocument(); // Google Logo SVG
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<GoogleSignInButton onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<GoogleSignInButton onClick={() => {}} disabled={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
