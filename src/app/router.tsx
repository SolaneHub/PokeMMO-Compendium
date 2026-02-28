import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "@/app/App";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Shell from "@/components/templates/Shell";
import AdminDashboardPage from "@/pages/admin/dashboard/AdminDashboardPage";
import MoveEditorPage from "@/pages/admin/move-editor/MoveEditorPage";
import PokedexEditorPage from "@/pages/admin/pokedex-editor/PokedexEditorPage";
import AuthPage from "@/pages/auth/AuthPage";
import BossFightsPage from "@/pages/boss-fights/BossFightsPage";
import BreedingPage from "@/pages/breeding/BreedingPage";
import CatchCalculatorPage from "@/pages/catch-calculator/CatchCalculatorPage";
import EliteFourPage from "@/pages/elite-four/EliteFourPage";
import HomePage from "@/pages/home/Home";
import { myTeamsLoader } from "@/pages/my-teams/myTeamsLoader";
import MyTeamsPage from "@/pages/my-teams/MyTeamsPage";
import UserTeamEditorPage from "@/pages/my-teams/UserTeamEditorPage";
import PickupPage from "@/pages/pickup/PickupPage";
import PokedexPage from "@/pages/pokedex/PokedexPage";
import RaidsPage from "@/pages/raids/RaidsPage";
import SuperTrainersPage from "@/pages/super-trainers/SuperTrainersPage";
import TrainerRerunPage from "@/pages/trainer-rerun/TrainerRerunPage";

export const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        {
          element: <Shell />,
          children: [
            {
              path: "/",
              element: <HomePage />,
            },
            {
              path: "/elite-four",
              element: <EliteFourPage />,
            },
            {
              path: "/boss-fights",
              element: <BossFightsPage />,
            },
            {
              path: "/super-trainers",
              element: <SuperTrainersPage />,
            },
            {
              path: "/trainer-rerun",
              element: <TrainerRerunPage />,
            },
            {
              path: "/raids",
              element: <RaidsPage />,
            },
            {
              path: "/catch-calculator",
              element: <CatchCalculatorPage />,
            },
            {
              path: "/pokedex",
              element: <PokedexPage />,
            },
            {
              path: "/pickup",
              element: <PickupPage />,
            },
            {
              path: "/breeding",
              element: <BreedingPage />,
            },
            {
              path: "/login",
              element: <AuthPage />,
            },
            {
              path: "/signup",
              element: <AuthPage isSignup />,
            },
            {
              path: "/my-teams",
              loader: myTeamsLoader,
              element: (
                <ProtectedRoute>
                  <MyTeamsPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/my-teams/:id",
              element: (
                <ProtectedRoute>
                  <UserTeamEditorPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin/dashboard",
              element: (
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin/pokedex-editor",
              element: (
                <ProtectedRoute adminOnly={true}>
                  <PokedexEditorPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin/move-editor",
              element: (
                <ProtectedRoute adminOnly={true}>
                  <MoveEditorPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin/edit-team/:userId/:id",
              element: (
                <ProtectedRoute adminOnly={true}>
                  <UserTeamEditorPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "*",
              element: <Navigate to="/" replace />,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
