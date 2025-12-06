# Gemini Context: PokeMMO Compendium

## Project Overview

**PokeMMO Compendium** is an interactive web guide for the game PokeMMO, designed to assist players with strategies for the Elite Four, breeding mechanics, raids, legendary encounters (Red, Ho-Oh), and more.

The project functions as a static web application deployed to GitHub Pages, but it features a unique **local development CMS** workflow. A lightweight Express backend runs locally to allow developers (or content maintainers) to edit the JSON data files directly via an in-app "Editor" page, which are then committed to the repository.

## Technical Stack

- **Framework:** [React 19](https://react.dev/) (Experimental `Activity` API used for view management).
- **Build Tool:** [Vite 7](https://vitejs.dev/).
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (configured via `@import "tailwindcss"` in CSS and Vite plugin).
- **Routing:** [React Router DOM 7](https://reactrouter.com/) (used for navigation state, though rendering is handled via React 19 `Activity`).
- **Backend (Local Only):** Node.js + [Express](https://expressjs.com/) (handles file system operations for `src/data/`).
- **Deployment:** [GitHub Pages](https://pages.github.com/).

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
│   │   └── layout/     # Layout components (Navbar, Home)
│   ├── data/           # JSON data files (The "Database")
│   ├── pages/          # Feature-specific pages
│   │   ├── breeding/   # Breeding calculators
│   │   ├── editor/     # CMS interface for editing JSON data
│   │   ├── elite-four/ # E4 strategies
│   │   ├── pokedex/    # Pokedex viewer
│   │   └── ...         # Other guides (Raids, Red, Ho-Oh, etc.)
│   └── shared/         # Reusable components and utilities
├── .prettierrc         # Prettier configuration
├── eslint.config.js    # ESLint configuration
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Key Commands

- **`npm run dev`**: Starts the development environment.
  - Runs the **Vite** frontend (typically `http://localhost:5173`) AND the **Express** backend (`http://localhost:3001`) concurrently.
  - _Use this for all development work._
- **`npm run server`**: Starts only the Express backend.
- **`npm run build`**: Compiles the application for production into the `dist/` directory.
- **`npm run preview`**: Locally previews the production build.
- **`npm run lint` / `npm run lint:fix`**: Runs ESLint to check/fix code quality issues.
- **`npm run format`**: Formats code using Prettier.
- **`npm run deploy`**: Deploys the `dist` folder to GitHub Pages.

## Architecture & Development Patterns

### 1. The "Local CMS" Pattern

The content (Elite Four teams, Raid data, Pokedex) is stored in static JSON files in `src/data/`.

- **Production:** The frontend imports these JSON files directly.
- **Development (Editing):** The `server/server.js` exposes endpoints (`GET /api/data`, `POST /api/data`) to read and overwrite these files. The `Editor` page in the frontend interacts with this API to provide a GUI for updating the game data.
- **Workflow:** Edit data via UI -> Save -> Backend writes to disk -> Git Commit -> Deploy.

### 2. React 19 `Activity` for Routing

Instead of standard Route switching where components unmount on navigation, `App.jsx` uses the React 19 `Activity` component (formerly `Offscreen`).

- **Mechanism:** All main page components are rendered simultaneously but toggled between `mode="visible"` and `mode="hidden"` based on the current route.
- **Benefit:** This preserves the internal state of complex pages (like the Breeding calculator or Multi-step forms) when navigating away and returning.

### 3. Styling

The project uses **Tailwind CSS v4**.

- Styles are defined in `src/app/index.css` using the `@import "tailwindcss";` directive.
- Configuration is minimal, relying on CSS variables and Tailwind's implicit defaults.
- Custom animations (`fade-in`, `scale-in`) are defined in standard CSS within `index.css`.

## Configuration Files

- **`vite.config.js`**: Sets up the React plugin with the Babel React Compiler and Tailwind CSS plugin. Configures the base path for GitHub Pages.
- **`package.json`**: Defines the `concurrently` script for running frontend and backend together.
