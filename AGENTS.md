# AGENTS.md - Project Context for AI Agents

## Project Overview

**Name:** PokéMMO Compendium
**Description:** A comprehensive, interactive guide and toolset for the game PokéMMO. It features battle strategies, calculators (breeding, catch rate), database viewers (Pokédex, drops), and user-specific features like team building.
**Type:** Single Page Application (SPA) with Firebase integration.

## Technology Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7
- **Backend (Cloud):** Firebase (Firestore, Authentication) for user and public game data.
- **Deployment:** Firebase Hosting (https://pokemmo-compendium.web.app/)

## Project Structure

- **`src/app/`**: Application entry point, global styles, central routing and providers.
- **`src/pages/`**: Feature-specific page components.
- **`src/components/`**: Atomic components (atoms, molecules, organisms, templates).
- **`src/context/`**: React contexts and providers (Auth, Toast, Confirmation).
- **`src/hooks/`**: Custom hooks.
- **`src/types/`**: Domain schemas and TypeScript types (Pokemon, Strategy, TrainerRerun, BossFights, etc.).
- **`src/utils/`**: Helper functions and utilities.
- **`src/constants/`**: Application constants.
- **`src/firebase/`**: Firebase configuration and domain-specific services.
- **`src/firebase/services/`**: Split services for Firestore operations (Teams, Pokedex, Moves, etc.).

## Key Files

- **`src/app/App.tsx`**: Root providers shell and Outlet container.
- **`src/app/router.tsx`**: Central router configuration, code-splitting (lazy loading) and route tree.
- **`src/firebase/services/`**: Collection of domain-specific Firestore services.
- **`package.json`**: Dependencies and scripts.
- **`vite.config.ts`**: Vite configuration (includes path aliases and base URL handling).

## Build and Run

- **Development:**
  ```bash
  pnpm dev
  ```

  - Starts the Vite frontend (localhost:5173).
- **Production Build:**
  ```bash
  pnpm build
  ```

  - Builds the app to the `dist/` folder.
- **Linting & Formatting:**
  ```bash
  pnpm lint
  pnpm format
  ```

## Development Conventions

- **Path Aliases:** Use `@/` to refer to the `src/` directory (configured in `vite.config.ts`).
- **Styling:** Use Tailwind CSS utility classes.
- **Data Handling:**
  - **Game & User Data:** Stored in Firebase Firestore. Accessed via domain-specific services in `src/firebase/services/`.
- **Routing:** All routes are defined in `src/app/router.tsx`. Protected routes are wrapped in `<ProtectedRoute>`.
- **Component Structure:** Feature-based folder structure is preferred (`src/pages/<feature>/components`).
