import { Outlet } from "react-router-dom";

import { AppProviders } from "./Providers";

function App() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}

export default App;
