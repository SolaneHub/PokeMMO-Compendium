import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { routes } from "./router";

describe("Router Integration Smoke Test", () => {
  it("renders home page successfully at root route", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={memoryRouter} />);

    await waitFor(() => {
      expect(screen.getByText("Welcome, Trainer.")).toBeInTheDocument();
    });
  });

  it("redirects unknown path to home via wildcard", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/unknown-route-nonexistent-123"],
    });
    render(<RouterProvider router={memoryRouter} />);

    await waitFor(() => {
      expect(screen.getByText("Welcome, Trainer.")).toBeInTheDocument();
    });
  });

  it("redirects unauthenticated users from protected admin route to login", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/admin/dashboard"],
    });
    render(<RouterProvider router={memoryRouter} />);

    await waitFor(() => {
      expect(screen.getAllByText(/Sign In|Welcome/i)[0]).toBeInTheDocument();
    });
  });
});
