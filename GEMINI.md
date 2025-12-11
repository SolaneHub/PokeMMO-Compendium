# Gemini Context: PokeMMO Compendium

## Project Overview

**PokeMMO Compendium** is an interactive web guide for the game PokeMMO, designed to assist players with strategies for the Elite Four, breeding mechanics, raids, legendary encounters (Red, Ho-Oh), and more.

The project functions as a static web application deployed to GitHub Pages, but it features two distinct data workflows:
1.  **Global Game Data (Local CMS):** A lightweight Express backend runs locally to allow developers to edit static JSON data (E4 teams, Pokedex) via an in-app "Editor" page.
2.  **User Data (Firebase):** A new "My Teams" feature allows authenticated users to create, save, and manage their own custom teams and strategies using Firebase Firestore.

## Technical Stack

-   **Framework:** [React 19.2.1](https://react.dev/) (Experimental `Activity` API used for view management).
-   **Build Tool:** [Vite 7.2.6](https://vitejs.dev/).
-   **Styling:** [Tailwind CSS 4.1.17](https://tailwindcss.com/) (configured via `@import "tailwindcss"` in CSS and Vite plugin).
-   **Routing:** [React Router DOM 7](https://reactrouter.com/) (used for navigation state, now dynamically configured with `import.meta.env.BASE_URL` to handle both local development and GitHub Pages deployment).
-   **Backend (Local Only):** Node.js + [Express 5.2.1](https://expressjs.com/) (handles file system operations for `src/data/`).
-   **Backend (Cloud):** [Firebase](https://firebase.google.com/) (Authentication & Firestore).
-   **Deployment:** [GitHub Pages](https://pages.github.io/).
-   **Icons:** [Lucide React](https://lucide.dev/icons/) and [React Icons 5.5.0](https://react-icons.github.io/react-icons/) (specifically Font Awesome).
-   **Drag and Drop:** [`dnd-kit 6.3.1`](https://dndkit.com/) (`@dnd-kit/core`, `@dnd-kit/sortable`).

## Project Structure

```text
/
├── dist/               # Production build output
├── public/             # Static assets (images, icons)
├── server/             # Local backend for data editing
│   └── server.js       # Express server (runs on port 3001)
├── src/
│   ├── app/            # Core app logic
│   │   ├── App.jsx     # Main component & routing logic
│   │   ├── index.css   # Global styles & Tailwind directives
│   │   ├── main.jsx    # Entry point and Router configuration
│   │   └── layout/     # Layout components (Navbar, Home)
│   ├── data/           # JSON data files (The "Static Database")
│   ├── firebase/       # Firebase configuration and service layer
│   │   ├── config.js   # App initialization
│   │   └── firestoreService.js # CRUD operations for My Teams
│   ├── pages/          # Feature-specific pages
│   │   ├── auth/       # Authentication (Login/Signup)
│   │   ├── boss-fights/
│   │   ├── breeding/
│   │   ├── catch-calculator/
│   │   ├── editor/     # Local CMS interface
│   │   ├── elite-four/
│   │   ├── my-teams/   # User-specific Team Builder
│   │   │   ├── MyTeamsPage.jsx      # Dashboard
│   │   │   └── UserTeamEditorPage.jsx # Strategy Editor
│   │   ├── pickup/
│   │   ├── pokedex/
│   │   ├── raids/
│   │   ├── super-trainers/
│   │   └── trainer-rerun/
│   └── shared/         # Reusable components and utilities
│       ├── components/
│       ├── context/    # Global state (AuthContext)
│       ├── hooks/
│       └── utils/
├── .prettierrc         # Prettier configuration
├── eslint.config.js    # ESLint configuration
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Key Commands

-   **`npm run dev`**: Starts the development environment.
    -   Runs the **Vite** frontend (typically `http://localhost:5173`) AND the **Express** backend (`http://localhost:3001`) concurrently.
    -   _Use this for all development work._
-   **`npm run server`**: Starts only the Express backend.
-   **`npm run build`**: Compiles the application for production into the `dist/` directory.
-   **`npm run preview`**: Locally previews the production build.
-   **`npm run lint` / `npm run lint:fix`**: Runs ESLint to check/fix code quality issues.
-   **`npm run format`**: Formats code using Prettier.
-   **`npm run deploy`**: Deploys the `dist` folder to GitHub Pages.

## Architecture & Development Patterns

### 1. The "Local CMS" Pattern (Global Data)

The core game content (Elite Four teams, Raid data, Pokedex) is stored in static JSON files in `src/data/`.

-   **Development (Editing):** The `server/server.js` exposes endpoints (`GET /api/data`, `POST /api/data`) to read and overwrite these files. The `Editor` page in the frontend interacts with this API.
-   **Workflow:** Edit data via UI -> Save -> Backend writes to disk -> Git Commit -> Deploy.

### 2. Firebase Integration & User Features ("My Teams")

A new personalized layer allows users to build their own strategies.

-   **Authentication:** Managed via `src/shared/context/AuthContext.jsx` using Firebase Auth. Supports Email/Password and Google Sign-in.
-   **Data Storage:** User teams are stored in Cloud Firestore under `users/{userId}/elite_four_teams`.
-   **Service Layer:** `src/firebase/firestoreService.js` abstracts all database interactions.
-   **Protected Routes:** Components check `useAuth()` state to redirect unauthenticated users.

### 3. React 19 `Activity` for Routing

Instead of standard Route switching where components unmount on navigation, `App.jsx` uses the React 19 `Activity` component.

-   **Mechanism:** Main page components are rendered simultaneously but toggled between `mode="visible"` and `mode="hidden"`.
-   **Benefit:** Preserves internal state (forms, scroll position, calculator inputs) when switching tabs.

### 4. Dynamic Base URL Handling

The application handles different base URLs for development (`/`) and production (`/PokeMMO-Compendium/`).

-   **`vite.config.js`**: Sets `base` appropriately.
-   **`src/app/main.jsx`**: Uses `import.meta.env.BASE_URL` for `BrowserRouter`.
-   **Asset Paths**: Internal asset paths are prefixed with `import.meta.env.BASE_URL` to ensure correct loading on GitHub Pages.

### 5. Styling

The project uses **Tailwind CSS v4**.

-   Styles are defined in `src/app/index.css` using the `@import "tailwindcss";` directive.
-   Custom animations (`fade-in`, `scale-in`) are defined in standard CSS within `index.css`.

### 6. Editor Page UX/UI (Local CMS)

The `src/pages/editor/` features a rich interface for managing the static JSON data:

-   **Sidebar Navigation:** Visual navigation for different data types.
-   **Visual Editors:** Interactive cards and sprite selectors for Elite Four teams.
-   **Drag & Drop:** `dnd-kit` is used for reordering strategy steps.
-   **Smart Inputs:** Autocomplete fields driven by `pokedex.json`.

## Configuration Files

-   **`vite.config.js`**: React plugin, Tailwind CSS plugin, Base path config.
-   **`package.json`**: Dependencies and `concurrently` script.
-   **`.firebaserc` / `firebase.json`**: (If present) Firebase project configuration.
