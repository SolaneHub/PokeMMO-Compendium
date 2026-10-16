import { Outlet } from "react-router-dom";

import { MovesProvider } from "@/context/MovesContext";

export default function MovesLayout() {
  return (
    <MovesProvider>
      <Outlet />
    </MovesProvider>
  );
}
