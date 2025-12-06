# Gemini Context: PokeMMO Compendium

## Project Overview

**PokeMMO Compendium** is a comprehensive, interactive guide for the game PokeMMO. It helps players with Elite Four strategies, breeding, raids, and legendary encounters.

**Key Technologies:**

- **Frontend:** React 19, Vite 7, Tailwind CSS 4.
- **Routing:** React Router Dom 7.
- **Backend (Local Dev):** Express.js (used for reading/writing JSON data files locally).
- **Data Storage:** JSON files located in `src/data/`.
- **Deployment:** GitHub Pages.

## Building and Running

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Key Commands

- **Development:** `npm run dev`
  - Starts both the Vite frontend (typically http://localhost:5173) and the Express backend (http://localhost:3001) concurrently.
- **Build:** `npm run build`
  - Compiles the React app into the `dist/` directory.
- **Lint:** `npm run lint` (and `npm run lint:fix`)
  - Runs ESLint.
- **Format:** `npm run format`
  - Runs Prettier.
- **Deploy:** `npm run deploy`
  - Deploys the `dist` folder to GitHub Pages.

## Architecture & Data Flow

### Frontend (`src/`)

The application is structured by features within `src/pages/`:

- **`elite-four/`**: Strategies for E4 battles.
- **`breeding/`**: IV/Nature calculators and guides.
- **`editor/`**: A specialized interface for editing the JSON data files.
- **`raids/`**, **`red/`**, **`ho-oh/`**: Specific guide sections.

### Backend (`server/`)

- **`server/server.js`**: A simple Express server that exposes endpoints (`GET/POST /api/data`) to read and write files in `src/data/`.
- **Usage:** This backend allows the `EditorPage` in the frontend to modify the static JSON files directly on the developer's machine. This serves as a CMS for the project.

### Styling

The project is currently migrating to **Tailwind CSS (v4)**.

- New components should use Tailwind utility classes.
- Existing CSS files (`App.css`, component-specific `.css`) are being converted.

## Development Conventions

- **Data-Driven:** Most content (strategies, stats, moves) should be stored in `src/data/*.json` rather than hardcoded in components.
- **Components:** Functional components with hooks.
- **State Management:** React Context or local state (`useState`, `useReducer`). Custom hook `usePersistentState` is used for local storage persistence.
- **Linting/Formatting:** Adhere to the project's ESLint and Prettier configurations.

## Key Files

- `src/app/App.jsx`: Main application component and routing setup.
- `src/data/`: Directory containing all the game data (Elite Four teams, Pokedex, etc.).
- `server/server.js`: Local backend for data manipulation.
- `vite.config.js`: Vite configuration.
- `tailwind.config.js` (or implicit v4 config): Tailwind setup.
