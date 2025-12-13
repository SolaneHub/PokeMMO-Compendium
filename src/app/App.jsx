import { Activity } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "@/app/layout/Home";
import Shell from "@/app/layout/Shell";
import AdminApprovalsPage from "@/pages/admin/approvals/AdminApprovalsPage";
import AuthPage from "@/pages/auth/AuthPage";
import BossFightsPage from "@/pages/boss-fights/BossFightsPage";
import BreedingPage from "@/pages/breeding/BreedingPage";
import CatchCalculatorPage from "@/pages/catch-calculator/CatchCalculatorPage";
import EditorPage from "@/pages/editor/EditorPage";
import EliteFourPage from "@/pages/elite-four/EliteFourPage";
import MyTeamsPage from "@/pages/my-teams/MyTeamsPage";
import UserTeamEditorPage from "@/pages/my-teams/UserTeamEditorPage";
import PickupPage from "@/pages/pickup/PickupPage";
import PokedexPage from "@/pages/pokedex/PokedexPage";
import RaidsPage from "@/pages/raids/RaidsPage";
import SuperTrainersPage from "@/pages/super-trainers/SuperTrainersPage";
import TrainerRerunPage from "@/pages/trainer-rerun/TrainerRerunPage";
import { ConfirmationProvider } from "@/shared/components/ConfirmationModal"; // New import
import { ToastProvider } from "@/shared/components/ToastNotification";
import { AuthProvider } from "@/shared/context/AuthContext";

function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  const noPaddingRoutes = ["/editor"];
  const shouldRemovePadding = noPaddingRoutes.includes(currentPath);

  const pages = [
    { path: "/", Component: Home, key: "home" },
    { path: "/elite-four", Component: EliteFourPage, key: "e4" },
    { path: "/boss-fights", Component: BossFightsPage, key: "boss-fights" },
    {
      path: "/super-trainers",
      Component: SuperTrainersPage,
      key: "super-trainers",
    },
    {
      path: "/trainer-rerun",
      Component: TrainerRerunPage,
      key: "trainer-rerun",
    },
    { path: "/raids", Component: RaidsPage, key: "raids" },
    {
      path: "/catch-calculator",
      Component: CatchCalculatorPage,
      key: "catch-calculator",
    },
    { path: "/pokedex", Component: PokedexPage, key: "pokedex" },
    { path: "/pickup", Component: PickupPage, key: "pickup" },
    { path: "/breeding", Component: BreedingPage, key: "breeding" },
    {
      path: "/admin/approvals",
      Component: AdminApprovalsPage,
      key: "admin-approvals",
    },
  ];

  if (!import.meta.env.PROD) {
    pages.push({ path: "/editor", Component: EditorPage, key: "editor" });
  }

  return (
    <ConfirmationProvider>
      {" "}
      {/* Wrap with ConfirmationProvider */}
      <AuthProvider>
        <ToastProvider>
          {" "}
          {/* Wrap with ToastProvider */}
          <Shell noPadding={shouldRemovePadding}>
            {pages.map(({ path, Component, key, props }) => {
              const isActive = currentPath === path;
              return (
                <Activity key={key} mode={isActive ? "visible" : "hidden"}>
                  <div
                    className="h-full w-full"
                    style={{ display: isActive ? "block" : "none" }}
                  >
                    {props ? <Component {...props} /> : <Component />}
                  </div>
                </Activity>
              );
            })}

            <Routes>
              {/* Catch-all route to silence "No routes matched" warning for Activity pages */}
              <Route path="*" element={null} />

              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage isSignup />} />
              <Route path="/my-teams" element={<MyTeamsPage />} />
              <Route path="/my-teams/:id" element={<UserTeamEditorPage />} />
            </Routes>
          </Shell>
        </ToastProvider>
      </AuthProvider>
    </ConfirmationProvider>
  );
}

export default App;
