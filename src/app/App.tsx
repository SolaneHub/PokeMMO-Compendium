import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Shell from "@/components/templates/Shell";
import { AuthProvider } from "@/context/AuthContext";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import { MovesProvider } from "@/context/MovesContext";
import { PokedexProvider } from "@/context/PokedexContext";
import { ToastProvider } from "@/context/ToastContext";
import AdminDashboardPage from "@/pages/admin/dashboard/AdminDashboardPage";
import MoveEditorPage from "@/pages/admin/move-editor/MoveEditorPage";
import PokedexEditorPage from "@/pages/admin/pokedex-editor/PokedexEditorPage";
import AuthPage from "@/pages/auth/AuthPage";
import BossFightsPage from "@/pages/boss-fights/BossFightsPage";
import BreedingPage from "@/pages/breeding/BreedingPage";
import CatchCalculatorPage from "@/pages/catch-calculator/CatchCalculatorPage";
import EliteFourPage from "@/pages/elite-four/EliteFourPage";
import HomePage from "@/pages/home/Home";
import MyTeamsPage from "@/pages/my-teams/MyTeamsPage";
import UserTeamEditorPage from "@/pages/my-teams/UserTeamEditorPage";
import PickupPage from "@/pages/pickup/PickupPage";
import PokedexPage from "@/pages/pokedex/PokedexPage";
import RaidsPage from "@/pages/raids/RaidsPage";
import SuperTrainersPage from "@/pages/super-trainers/SuperTrainersPage";
import TrainerRerunPage from "@/pages/trainer-rerun/TrainerRerunPage";

function App() {
  return (
    <PokedexProvider>
      <MovesProvider>
        <ConfirmationProvider>
          <AuthProvider>
            <ToastProvider>
              <Shell>
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/elite-four" element={<EliteFourPage />} />
                  <Route path="/boss-fights" element={<BossFightsPage />} />
                  <Route
                    path="/super-trainers"
                    element={<SuperTrainersPage />}
                  />
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
                    path="/admin/pokedex-editor"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <PokedexEditorPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/move-editor"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <MoveEditorPage />
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
      </MovesProvider>
    </PokedexProvider>
  );
}

export default App;
