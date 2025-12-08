# Gemini Context: PokeMMO Compendium

## Project Overview

**PokeMMO Compendium** is an interactive web guide for the game PokeMMO, designed to assist players with strategies for the Elite Four, breeding mechanics, raids, legendary encounters (Red, Ho-Oh), and more.

The project functions as a static web application deployed to GitHub Pages, but it features a unique **local development CMS** workflow. A lightweight Express backend runs locally to allow developers (or content maintainers) to edit the JSON data files directly via an in-app "Editor" page, which are then committed to the repository.

## Technical Stack

- **Framework:** [React 19.2.1](https://react.dev/) (Experimental `Activity` API used for view management).
- **Build Tool:** [Vite 7.2.6](https://vitejs.dev/).
- **Styling:** [Tailwind CSS 4.1.17](https://tailwindcss.com/) (configured via `@import "tailwindcss"` in CSS and Vite plugin).
- **Routing:** [React Router DOM 7](https://reactrouter.com/) (used for navigation state, now dynamically configured with `import.meta.env.BASE_URL` to handle both local development and GitHub Pages deployment, though rendering is handled via React 19 `Activity`).
- **Backend (Local Only):** Node.js + [Express 5.2.1](https://expressjs.com/) (handles file system operations for `src/data/`).
- **Deployment:** [GitHub Pages](https://pages.github.io/).
- **Icons:** [Lucide React](https://lucide.dev/icons/) and [React Icons 5.5.0](https://react-icons.github.io/react-icons/) (specifically Font Awesome).
- **Drag and Drop:** [`dnd-kit 6.3.1`](https://dndkit.com/) (`@dnd-kit/core`, `@dnd-kit/sortable`).

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
│   ├── data/           # JSON data files (The "Database")
│   ├── pages/          # Feature-specific pages
│   │   ├── boss-fights/ # Boss Fights strategies
│   │   ├── breeding/   # Breeding calculators
│   │   ├── catch-calculator/ # Catch Rate Calculator
│   │   ├── editor/     # CMS interface for editing JSON data
│   │   ├── elite-four/ # E4 strategies
│   │   ├── pickup/     # Pickup item data
│   │   ├── pokedex/    # Pokedex viewer
│   │   ├── raids/      # Raid strategies
│   │   ├── super-trainers/ # Super Trainer strategies
│   │   └── trainer-rerun/ # Trainer Rerun routes
│   └── shared/         # Reusable components and utilities
│       ├── components/ # Reusable UI components (e.g., ToastNotification)
│       ├── hooks/      # Reusable React hooks (e.g., usePokedexData)
│       └── utils/      # Utility functions (e.g., pokedexDataExtraction)
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

### 3. Dynamic Base URL Handling

The application is configured to handle different base URLs for development and production environments, ensuring correct routing and asset loading:

- **`vite.config.js`**: Sets `base` to `/` for local development (`command === "serve"`) and `/PokeMMO-Compendium/` for production builds.
- **`src/app/main.jsx`**: Uses `import.meta.env.BASE_URL` for `BrowserRouter`'s `basename` prop, dynamically adapting the router's base path.
- **Asset Paths**: Internal asset paths (e.g., for images in `public/`) are prefixed with `import.meta.env.BASE_URL` in components like `CatchCalculatorPage`, `SuperTrainersPage`, `PickupPage`, `BossFightsPage`, and `RaidsPage` to ensure they load correctly regardless of the deployment subpath.

### 4. Styling

The project uses **Tailwind CSS v4**.

- Styles are defined in `src/app/index.css` using the `@import "tailwindcss";` directive.
- Configuration is minimal, relying on CSS variables and Tailwind's implicit defaults.
- Custom animations (`fade-in`, `scale-in`) are defined in standard CSS within `index.css`.

### 5. Radical UX/UI Improvements for the Editor Page (Implemented)

The Editor page (`src/pages/editor/`) has undergone significant enhancements to provide a more intuitive and user-friendly content management experience:

- **Enhanced Navigation:** The generic file selection dropdown has been replaced with a visually rich sidebar navigation (`EditorSidebar.jsx`) featuring icons and user-friendly labels for different data types.
- **Visual Data Representation (Elite Four Editor):**
  - Elite Four members are now selected via interactive cards displaying their trainer images.
  - Teams are presented with clickable Pokémon sprites (`EliteFourTeamOverview.jsx`), offering a clear and engaging selection process.
  - Strategies (`EliteFourEditor.jsx`) now support **drag-and-drop reordering** for steps and nested steps, powered by [`dnd-kit`](https://dndkit.com/), greatly improving content organization.
- **Intelligent Input Forms (`StepForm.jsx`, `VariationForm.jsx`):**
  - Generic text inputs have been replaced with smart input fields (e.g., `<select>` dropdowns for predefined types, `<datalist>` for autocompletion of Pokémon names, moves, abilities, and items).
  - These intelligent inputs are driven by pre-processed data from `pokedex.json` via a custom `usePokedexData` hook and `pokedexDataExtraction.js` utility.
  - Conditional rendering ensures that only relevant input fields are displayed based on the `step.type`.
- **Improved Universal JSON Editor (`UniversalJsonEditor.jsx`):**
  - **Collapsible Sections:** Large JSON objects and arrays can now be collapsed/expanded, significantly improving navigability and reducing visual clutter.
  - **User-Friendly Field Management:** The generic `<select>` for adding new fields has been replaced with dedicated buttons for "Suggested Fields" and "Custom Fields," providing a more intuitive workflow.
  - **Empty State Cues:** Clear visual messages (e.g., "Empty List," "Empty Object") are displayed for empty data structures, enhancing user feedback.
- **Robust Saving and Feedback:** Intrusive `alert()` messages have been replaced with a custom, non-blocking toast notification system (`ToastNotification.jsx` and `useToast` hook) for all save operations and data loading errors, providing a smoother user experience.

## Configuration Files

- **`vite.config.js`**: Sets up the React plugin with the Babel React Compiler and Tailwind CSS plugin. Configures the base path for GitHub Pages.
- **`package.json`**: Defines the `concurrently` script for running frontend and backend together.