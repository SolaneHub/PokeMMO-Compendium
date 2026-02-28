import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StatusBadge from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders 'Approved' status correctly", () => {
    render(<StatusBadge status="approved" />);
    const badge = screen.getByText("Approved");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-green-400");
    // Checks if icon is rendered by looking for SVG element
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("renders 'Rejected' status correctly", () => {
    render(<StatusBadge status="rejected" />);
    const badge = screen.getByText("Rejected");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-red-400");
  });

  it("renders 'Pending' status correctly", () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText("Pending");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-amber-400");
  });

  it("renders 'Draft' status correctly with no icon", () => {
    render(<StatusBadge status="draft" />);
    const badge = screen.getByText("Draft");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-slate-500");
    expect(document.querySelector("svg")).not.toBeInTheDocument();
  });
});
