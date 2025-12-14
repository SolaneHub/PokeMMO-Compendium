import { lazy, Suspense, useEffect } from "react"; // Import useEffect
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
import { usePokedexData } from "@/shared/hooks/usePokedexData"; // Import usePokedexData
import { initializePokemonColorMap } from "@/shared/utils/pokemonMoveColors"; // Import initializePokemonColorMap

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

  const { allPokemonData, isLoading } = usePokedexData(); // Use usePokedexData

  useEffect(() => {
    if (!isLoading && allPokemonData.length > 0) {
      initializePokemonColorMap(allPokemonData);
    }
  }, [allPokemonData, isLoading]);

  const noPaddingRoutes = ["/editor"];
  const shouldRemovePadding =
    noPaddingRoutes.includes(currentPath) ||
    currentPath.startsWith("/my-teams/");

  return (
    <ConfirmationProvider>
      <AuthProvider>
        <ToastProvider>
          <Shell noPadding={shouldRemovePadding}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/elite-four" element={<EliteFourPage />} />
                <Route path="/boss-fights" element={<BossFightsPage />} />
                <Route path="/super-trainers" element={<SuperTrainersPage />} />
                <Route path="/trainer-rerun" element={<TrainerRerunPage />} />
                <Route path="/raids" element={<RaidsPage />} />
                <Route
                  path="/catch-calculator"
                  element={<CatchCalculatorPage />}
                />
                <Route path="/pokedex" element={<PokedexPage />} />
                <Route path="/pickup" element={<PickupPage />} />
                <Route path="/breeding" element={<BreedingPage />} />

                {/* Dev Only Routes */}
                {!import.meta.env.PROD && (
                  <Route path="/editor" element={<EditorPage />} />
                )}

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
