import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ErrorBoundary from "./ErrorBoundary";

const ProblemChild = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error!");
  }
  return <div>Everything is fine</div>;
};

describe("ErrorBoundary component", () => {
  // Suppress console.error for the intentional errors
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText("Everything is fine")).toBeInTheDocument();
  });

  it("renders default fallback UI when an error occurs", () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error!")).toBeInTheDocument();
  });

  it("allows retrying from default fallback UI", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Pass a safe child and retry
    rerender(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByText("Try Again"));

    expect(screen.getByText("Everything is fine")).toBeInTheDocument();
  });

  it("renders custom fallback if provided", () => {
    const CustomFallback = (error: Error | null) => (
      <div>Custom error: {error?.message}</div>
    );

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error: Test error!")).toBeInTheDocument();
  });
});
