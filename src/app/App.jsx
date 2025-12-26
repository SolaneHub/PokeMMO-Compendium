import { useEffect } from "react"; // Remove lazy, Suspense
import { Route, Routes, useLocation } from "react-router-dom";

import HomePage from "@/app/layout/Home";
import Shell from "@/app/layout/Shell";
import AdminDashboardPage from "@/pages/admin/dashboard/AdminDashboardPage";
import AuthPage from "@/pages/auth/AuthPage";
import BossFightsPage from "@/pages/boss-fights/BossFightsPage";
import BreedingPage from "@/pages/breeding/BreedingPage";
import CatchCalculatorPage from "@/pages/catch-calculator/CatchCalculatorPage";
import EliteFourPage from "@/pages/elite-four/EliteFourPage";
import MyTeamsPage from "@/pages/my-teams/MyTeamsPage";
import UserTeamEditorPage from "@/pages/my-teams/UserTeamEditorPage";
import PickupPage from "@/pages/pickup/PickupPage";
import PokedexPage from "@/pages/pokedex/PokedexPage";
import RaidsPage from "@/pages/raids/RaidsPage";
import SuperTrainersPage from "@/pages/super-trainers/SuperTrainersPage";
import TrainerRerunPage from "@/pages/trainer-rerun/TrainerRerunPage";
import { ConfirmationProvider } from "@/shared/components/ConfirmationModal";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { ToastProvider } from "@/shared/components/ToastNotification";
import { AuthProvider } from "@/shared/context/AuthContext";
import { usePokedexData } from "@/shared/hooks/usePokedexData";
import { initializePokemonColorMap } from "@/shared/utils/pokemonMoveColors";

function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  const { allPokemonData, isLoading } = usePokedexData();

  useEffect(() => {
    if (!isLoading && allPokemonData.length > 0) {
      initializePokemonColorMap(allPokemonData);
    }
  }, [allPokemonData, isLoading]);

  const shouldRemovePadding =
    currentPath.startsWith("/my-teams/") ||
    currentPath.startsWith("/admin/edit-team/");

  return (
    <ConfirmationProvider>
      <AuthProvider>
        <ToastProvider>
          <Shell noPadding={shouldRemovePadding}>
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
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit-team/:userId/:id"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <UserTeamEditorPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Shell>
        </ToastProvider>
      </AuthProvider>
    </ConfirmationProvider>
  );
}

export default App;
