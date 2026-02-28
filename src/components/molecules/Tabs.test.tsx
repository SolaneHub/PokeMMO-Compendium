import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Tabs from "./Tabs";

describe("Tabs component", () => {
  const tabs = ["Tab A", "Tab B", "Tab C"];

  it("renders all tabs", () => {
    render(
      <Tabs
        tabs={tabs}
        activeTab="Tab A"
        onTabChange={() => {
          /* noop */
        }}
      />
    );
    expect(screen.getByText("Tab A")).toBeInTheDocument();
    expect(screen.getByText("Tab B")).toBeInTheDocument();
    expect(screen.getByText("Tab C")).toBeInTheDocument();
  });

  it("highlights the active tab", () => {
    render(
      <Tabs
        tabs={tabs}
        activeTab="Tab B"
        onTabChange={() => {
          /* noop */
        }}
      />
    );
    const activeTab = screen.getByText("Tab B");
    const inactiveTab = screen.getByText("Tab A");

    expect(activeTab).toHaveClass("text-blue-400");
    expect(inactiveTab).toHaveClass("text-slate-500");
  });

  it("calls onTabChange when a tab is clicked", () => {
    const handleChange = vi.fn();
    render(<Tabs tabs={tabs} activeTab="Tab A" onTabChange={handleChange} />);

    fireEvent.click(screen.getByText("Tab C"));
    expect(handleChange).toHaveBeenCalledWith("Tab C");
  });
});
