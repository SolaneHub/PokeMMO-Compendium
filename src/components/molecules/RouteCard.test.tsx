import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RouteCard from "./RouteCard";

describe("RouteCard component", () => {
  const mockRoute = {
    name: "Route 1",
    notes: ["Use Surf", "Beware of trainers"],
    trainers: [{ name: "Youngster Joey", money: 100 }],
    pp_cost: 5,
    type: "action",
  };

  it("renders route name", () => {
    render(<RouteCard route={mockRoute} />);
    expect(screen.getByText("Route 1")).toBeInTheDocument();
  });

  it("renders notes if present", () => {
    render(<RouteCard route={mockRoute} />);
    expect(screen.getByText("Use Surf")).toBeInTheDocument();
    expect(screen.getByText("Beware of trainers")).toBeInTheDocument();
  });

  it("renders trainers with money if present", () => {
    render(<RouteCard route={mockRoute} />);
    expect(screen.getByText("Youngster Joey")).toBeInTheDocument();
    expect(screen.getByText("($100)")).toBeInTheDocument();
  });

  it("renders pp_cost if present", () => {
    render(<RouteCard route={mockRoute} />);
    expect(screen.getByText("PP Cost:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders action required tag if type is action", () => {
    render(<RouteCard route={mockRoute} />);
    expect(screen.getByText("Action Required")).toBeInTheDocument();
  });

  it("does not render notes or trainers sections if not present", () => {
    render(<RouteCard route={{ name: "Route 2" }} />);
    expect(screen.getByText("Route 2")).toBeInTheDocument();
    expect(screen.queryByText("Trainers")).not.toBeInTheDocument();
  });
});
