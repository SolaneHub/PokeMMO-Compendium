import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import App from "@/app/App";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Shell from "@/components/Shell";
import { MovesProvider } from "@/context/MovesContext";
import { myTeamsLoader } from "@/pages/my-teams/myTeamsLoader";

const AdminDashboardPage = lazy(
  () => import("@/pages/admin/dashboard/AdminDashboardPage")
);
const MoveEditorPage = lazy(
  () => import("@/pages/admin/move-editor/MoveEditorPage")
);
const PokedexEditorPage = lazy(
  () => import("@/pages/admin/pokedex-editor/PokedexEditorPage")
);
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const BossFightsPage = lazy(() => import("@/pages/boss-fights/BossFightsPage"));
const BreedingPage = lazy(() => import("@/pages/breeding/BreedingPage"));
const CatchCalculatorPage = lazy(
  () => import("@/pages/catch-calculator/CatchCalculatorPage")
);
const EliteFourPage = lazy(() => import("@/pages/elite-four/EliteFourPage"));
const HomePage = lazy(() => import("@/pages/home/Home"));
const MyTeamsPage = lazy(() => import("@/pages/my-teams/MyTeamsPage"));
const UserTeamEditorPage = lazy(
  () => import("@/pages/my-teams/UserTeamEditorPage")
);
const PickupPage = lazy(() => import("@/pages/pickup/PickupPage"));
const PokedexPage = lazy(() => import("@/pages/pokedex/PokedexPage"));
const RaidsPage = lazy(() => import("@/pages/raids/RaidsPage"));
const SuperTrainersPage = lazy(
  () => import("@/pages/super-trainers/SuperTrainersPage")
);
const TrainerRerunPage = lazy(
  () => import("@/pages/trainer-rerun/TrainerRerunPage")
);

export const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        {
          element: <Shell />,
          children: [
            {
              element: (
                <Suspense
                  fallback={
                    <div className="p-8 text-center text-slate-400">
                      Loading...
                    </div>
                  }
                >
                  <Outlet />
                </Suspense>
              ),
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
                      <MovesProvider>
                        <UserTeamEditorPage />
                      </MovesProvider>
                    </ProtectedRoute>
                  ),
                },
                {
                  element: (
                    <ProtectedRoute adminOnly={true}>
                      <MovesProvider>
                        <Outlet />
                      </MovesProvider>
                    </ProtectedRoute>
                  ),
                  children: [
                    {
                      path: "/admin/dashboard",
                      element: <AdminDashboardPage />,
                    },
                    {
                      path: "/admin/pokedex-editor",
                      element: <PokedexEditorPage />,
                    },
                    {
                      path: "/admin/move-editor",
                      element: <MoveEditorPage />,
                    },
                    {
                      path: "/admin/edit-team/:userId/:id",
                      element: <UserTeamEditorPage />,
                    },
                  ],
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
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
