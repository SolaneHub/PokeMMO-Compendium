# GEMINI.md - Project Context for AI Agents

## Project Overview

**Name:** PokéMMO Compendium
**Description:** A comprehensive, interactive guide and toolset for the game PokéMMO. It features battle strategies, calculators (breeding, catch rate), database viewers (Pokédex, drops), and user-specific features like team building.
**Type:** Single Page Application (SPA) with a local CMS backend and Firebase integration.

## Technology Stack

*   **Frontend Framework:** React 18
*   **Build Tool:** Vite 6
*   **Styling:** Tailwind CSS 4
*   **Routing:** React Router 7
*   **Backend (Cloud):** Firebase (Firestore, Authentication) for user data and public team sharing.
*   **Backend (Local):** Node.js/Express (handling local JSON file edits for the "CMS" features).
*   **Deployment:** GitHub Pages.

## Project Structure

*   **`src/app/`**: Application entry point, global styles (`index.css`), and layout components (`Shell`, `Sidebar`).
*   **`src/pages/`**: Feature-specific page components.
    *   `admin/`: Admin dashboard and editors.
    *   `auth/`: Login/Signup pages.
    *   `my-teams/`: User team builder (Firebase interaction).
    *   Other directories correspond to specific features (e.g., `breeding`, `elite-four`, `pokedex`).
*   **`src/shared/`**: Reusable code.
    *   `components/`: UI components used across multiple pages.
    *   `context/`: Global state providers (`AuthContext`, `ToastNotification`).
    *   `hooks/`: Custom hooks (e.g., `usePokedexData`, `useAdminCheck`).
    *   `utils/`: Helper functions and static data transformations.
*   **`src/firebase/`**: Firebase configuration and `firestoreService.js` (DAL).
*   **`src/data/`**: JSON files serving as the static database for the app content.
*   **`server/`**: Local Express server for reading/writing `src/data` JSON files (used by the Editor page).

## Key Files

*   **`src/app/App.jsx`**: Main application component containing the Routing logic.
*   **`src/firebase/firestoreService.js`**: Centralized service for all Firestore operations (CRUD for Teams, Pokedex, etc.).
*   **`package.json`**: Dependencies and scripts.
*   **`vite.config.js`**: Vite configuration (includes path aliases and base URL handling).
*   **`server/server.js`**: Local backend API.

## Build and Run

*   **Development:**
    ```bash
    npm run dev
    ```
    *   Starts both the Vite frontend (localhost:5173) and the local Express server (localhost:3001) concurrently.
*   **Production Build:**
    ```bash
    npm run build
    ```
    *   Builds the app to the `dist/` folder. Copies `index.html` to `404.html` for SPA routing on GitHub Pages.
*   **Linting & Formatting:**
    ```bash
    npm run lint
    npm run format
    ```

## Development Conventions

*   **Path Aliases:** Use `@/` to refer to the `src/` directory (configured in `vite.config.js`).
*   **Styling:** Use Tailwind CSS utility classes.
*   **Data Handling:**
    *   **Static Data:** Stored in `src/data/*.json`. Modified via the local "Editor" page (requires `npm run dev`).
    *   **User Data:** Stored in Firebase Firestore. Accessed via `src/firebase/firestoreService.js`.
*   **Routing:** All routes are defined in `App.jsx`. Protected routes are wrapped in `<ProtectedRoute>`.
*   **Component Structure:** Feature-based folder structure is preferred (`src/pages/<feature>/components`).
