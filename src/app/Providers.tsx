import { ReactNode } from "react";

import { AuthProvider } from "@/context/AuthContext";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import { PokedexProvider } from "@/context/PokedexContext";
import { ToastProvider } from "@/context/ToastContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <PokedexProvider>
      <ConfirmationProvider>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </ConfirmationProvider>
    </PokedexProvider>
  );
};
