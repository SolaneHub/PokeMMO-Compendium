import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BulletList from "./BulletList";

describe("BulletList component", () => {
  it("renders nothing if items array is empty", () => {
    const { container } = render(<BulletList items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a list of items", () => {
    const items = [
      "Item 1",
      "Item 2",
      <span key="react-node">React Node Item</span>,
    ];
    render(<BulletList items={items} />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("React Node Item")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders a title if provided", () => {
    render(<BulletList title="My Important List" items={["Item"]} />);
    expect(screen.getByText("My Important List")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
