# GEMINI.md - Project Context for AI Agents

## Project Overview

**Name:** PokéMMO Compendium
**Description:** A comprehensive, interactive guide and toolset for the game PokéMMO. It features battle strategies, calculators (breeding, catch rate), database viewers (Pokédex, drops), and user-specific features like team building.
**Type:** Single Page Application (SPA) with Firebase integration.

## Technology Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7
- **Backend (Cloud):** Firebase (Firestore, Authentication) for user and public game data.
- **Deployment:** GitHub Pages.

## Project Structure

- **`src/app/`**: Application entry point and global styles.
- **`src/pages/`**: Feature-specific page components.
- **`src/components/`**: Atomic components (atoms, molecules, organisms, templates).
- **`src/context/`**: React contexts and providers (Auth, Toast, Confirmation).
- **`src/hooks/`**: Custom hooks.
- **`src/services/`**: API and data services.
- **`src/utils/`**: Helper functions and utilities.
- **`src/constants/`**: Application constants.
- **`src/firebase/`**: Firebase configuration and domain-specific services.
- **`src/firebase/services/`**: Split services for Firestore operations (Teams, Pokedex, Moves, etc.).

## Key Files

- **`src/app/App.tsx`**: Main application component containing the Routing logic.
- **`src/firebase/services/`**: Collection of domain-specific Firestore services.
- **`package.json`**: Dependencies and scripts.
- **`vite.config.ts`**: Vite configuration (includes path aliases and base URL handling).

## Build and Run

- **Development:**
  ```bash
  npm run dev
  ```

  - Starts the Vite frontend (localhost:5173).
- **Production Build:**
  ```bash
  npm run build
  ```

  - Builds the app to the `dist/` folder. Copies `index.html` to `404.html` for SPA routing on GitHub Pages.
- **Linting & Formatting:**
  ```bash
  npm run lint
  npm run format
  ```

## Development Conventions

- **Path Aliases:** Use `@/` to refer to the `src/` directory (configured in `vite.config.ts`).
- **Styling:** Use Tailwind CSS utility classes.
- **Data Handling:**
  - **Game & User Data:** Stored in Firebase Firestore. Accessed via domain-specific services in `src/firebase/services/`.
- **Routing:** All routes are defined in `App.tsx`. Protected routes are wrapped in `<ProtectedRoute>`.
- **Component Structure:** Feature-based folder structure is preferred (`src/pages/<feature>/components`).
