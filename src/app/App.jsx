import { Activity, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Shell from "@/app/layout/Shell";
const AdminApprovalsPage = lazy(
  () => import("@/pages/admin/approvals/AdminApprovalsPage")
);
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const MyTeamsPage = lazy(() => import("@/pages/my-teams/MyTeamsPage"));
const UserTeamEditorPage = lazy(
  () => import("@/pages/my-teams/UserTeamEditorPage")
);
import { ConfirmationProvider } from "@/shared/components/ConfirmationModal";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { ToastProvider } from "@/shared/components/ToastNotification";
import { AuthProvider } from "@/shared/context/AuthContext";

const HomePage = lazy(() => import("@/app/layout/Home"));
const EliteFourPage = lazy(() => import("@/pages/elite-four/EliteFourPage"));
const BossFightsPage = lazy(() => import("@/pages/boss-fights/BossFightsPage"));
const SuperTrainersPage = lazy(
  () => import("@/pages/super-trainers/SuperTrainersPage")
);
const TrainerRerunPage = lazy(
  () => import("@/pages/trainer-rerun/TrainerRerunPage")
);
const RaidsPage = lazy(() => import("@/pages/raids/RaidsPage"));
const CatchCalculatorPage = lazy(
  () => import("@/pages/catch-calculator/CatchCalculatorPage")
);
const PokedexPage = lazy(() => import("@/pages/pokedex/PokedexPage"));
const PickupPage = lazy(() => import("@/pages/pickup/PickupPage"));
const BreedingPage = lazy(() => import("@/pages/breeding/BreedingPage"));
const EditorPage = lazy(() => import("@/pages/editor/EditorPage"));

function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  const noPaddingRoutes = ["/editor"];
  const shouldRemovePadding = noPaddingRoutes.includes(currentPath);

  const pages = [
    { path: "/", Component: HomePage, key: "home" },
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
  ];

  if (!import.meta.env.PROD) {
    pages.push({ path: "/editor", Component: EditorPage, key: "editor" });
  }

  return (
    <ConfirmationProvider>
      <AuthProvider>
        <ToastProvider>
          <Shell noPadding={shouldRemovePadding}>
            {pages.map(({ path, Component, key, props }) => {
              const isActive = currentPath === path;
              return (
                <Activity key={key} mode={isActive ? "visible" : "hidden"}>
                  <div
                    className="h-full w-full"
                    style={{ display: isActive ? "block" : "none" }}
                  >
                    {isActive ? (
                      <Suspense fallback={<div>Loading page...</div>}>
                        {props ? <Component {...props} /> : <Component />}
                      </Suspense>
                    ) : null}
                  </div>
                </Activity>
              );
            })}

            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {/* Catch-all route to silence "No routes matched" warning for Activity pages */}
                <Route path="*" element={null} />

                {/* Auth routes */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage isSignup />} />

                {/* Protected user routes */}
                <Route
                  path="/my-teams"
                  element={
                    <ProtectedRoute>
                      <MyTeamsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-teams/:id"
                  element={
                    <ProtectedRoute>
                      <UserTeamEditorPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected admin routes */}
                <Route
                  path="/admin/approvals"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminApprovalsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </Shell>
        </ToastProvider>
      </AuthProvider>
    </ConfirmationProvider>
  );
}

export default App;
