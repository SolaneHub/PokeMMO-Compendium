import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PageTitle from "./PageTitle";

describe("PageTitle component", () => {
  it("sets the document title correctly", () => {
    render(<PageTitle title="My Test Title" />);
    expect(document.title).toBe("My Test Title");
  });

  it("updates the document title when prop changes", () => {
    const { rerender } = render(<PageTitle title="Initial Title" />);
    expect(document.title).toBe("Initial Title");

    rerender(<PageTitle title="Updated Title" />);
    expect(document.title).toBe("Updated Title");
  });
});
