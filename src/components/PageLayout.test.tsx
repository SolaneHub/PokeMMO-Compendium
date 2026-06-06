import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PageLayout from "./PageLayout";

describe("PageLayout", () => {
  it("renders title and children", () => {
    render(
      <PageLayout title="Test Page">
        <div data-testid="child">Content</div>
      </PageLayout>
    );

    expect(document.title).toBe("PokéMMO Compendium: Test Page");
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders without title if withTitle is false", () => {
    render(
      <PageLayout title="Test Page" withTitle={false}>
        <div>Content</div>
      </PageLayout>
    );

    expect(
      screen.queryByText("PokéMMO Compendium: Test Page")
    ).not.toBeInTheDocument();
  });
});
