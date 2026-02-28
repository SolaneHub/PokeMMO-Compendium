import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Dropdown from "./Dropdown";

describe("Dropdown component", () => {
  it("renders trigger and hides content by default", () => {
    render(
      <Dropdown trigger={<button>Open</button>}>
        <div>Content</div>
      </Dropdown>
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("shows content when trigger is clicked", () => {
    render(
      <Dropdown trigger={<button>Open</button>}>
        <div>Content</div>
      </Dropdown>
    );
    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("closes content when clicking outside", () => {
    render(
      <div>
        <Dropdown trigger={<button>Open</button>}>
          <div>Content</div>
        </Dropdown>
        <div data-testid="outside">Outside</div>
      </div>
    );

    // Open dropdown
    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Content")).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("uses controlled state if provided", () => {
    const handleOpenChange = vi.fn();
    render(
      <Dropdown
        trigger={<button>Open</button>}
        isOpen={true}
        onOpenChange={handleOpenChange}
      >
        <div>Content</div>
      </Dropdown>
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Open"));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
