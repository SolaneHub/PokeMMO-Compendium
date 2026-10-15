import { render, RenderOptions, RenderResult } from "@testing-library/react";
import React, { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import { MovesProvider } from "@/context/MovesContext";
import { PokedexProvider } from "@/context/PokedexContext";
import { ToastProvider } from "@/context/ToastContext";

/**
 * Custom render function that wraps components in necessary providers.
 * Aligned with AppProviders to provide Toast, Auth, Confirmation,
 * Pokedex, and Moves context.
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <PokedexProvider>
        <MovesProvider>
          <ConfirmationProvider>
            <AuthProvider>
              <ToastProvider>{children}</ToastProvider>
            </AuthProvider>
          </ConfirmationProvider>
        </MovesProvider>
      </PokedexProvider>
    </MemoryRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
