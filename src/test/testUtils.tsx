import { render, RenderOptions } from "@testing-library/react";
import React, { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { PokedexProvider } from "@/context/PokedexContext";
import { ToastProvider } from "@/context/ToastContext";

/**
 * Custom render function that wraps components in necessary providers.
 * This makes it easier to test components that depend on context.
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <ToastProvider>
        <AuthProvider>
          <PokedexProvider>{children}</PokedexProvider>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
