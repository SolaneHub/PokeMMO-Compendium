import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button from "./Button";

describe("Button component", () => {
  it("renders with children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows loading spinner when loading prop is true", () => {
    render(<Button loading>Click me</Button>);
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders with type attribute and responds to click", () => {
    const handleClick = vi.fn();
    render(
      <Button type="button" fullWidth onClick={handleClick}>
        Full Width Button
      </Button>
    );
    const button = screen.getByRole("button", { name: "Full Width Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders danger variant semantically as active clickable button", () => {
    const handleClick = vi.fn();
    render(
      <Button variant="danger" onClick={handleClick}>
        Delete
      </Button>
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
