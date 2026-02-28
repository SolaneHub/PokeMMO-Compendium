import { Outlet } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import { MovesProvider } from "@/context/MovesContext";
import { PokedexProvider } from "@/context/PokedexContext";
import { ToastProvider } from "@/context/ToastContext";

function App() {
  return (
    <PokedexProvider>
      <MovesProvider>
        <ConfirmationProvider>
          <AuthProvider>
            <ToastProvider>
              <Outlet />
            </ToastProvider>
          </AuthProvider>
        </ConfirmationProvider>
      </MovesProvider>
    </PokedexProvider>
  );
}

export default App;
