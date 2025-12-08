# 🏆 PokéMMO Compendium

**Your Ultimate Interactive Guide to Mastering PokéMMO**

Welcome to the **PokéMMO Compendium** — your comprehensive, step-by-step companion for conquering the most challenging battles and mastering essential game mechanics. Whether you're facing the Elite Four, breeding perfect Pokémon, calculating catch rates, or optimizing your farming strategies, this guide provides detailed, battle-tested approaches used by top players.

## 🎯 What This Guide Offers

### ⚔️ Battle Strategies & Walkthroughs
- **🏆 Elite Four**: Complete walkthroughs for every region (Kanto, Johto, Hoenn, Sinnoh, Unova) with proven team compositions and turn-by-turn strategies.
- **💀 Boss Fights**: Detailed guides for major boss encounters (Red, Ho-Oh, etc.), including enemy team analysis and optimal counters.
- **⚔️ Super Trainers**: Strategies to defeat the toughest NPC trainers in the game.
- **🤝 Raids**: Comprehensive raid guides with star-level filtering, role-based turn strategies, recommended builds, and mechanic breakdowns (HP thresholds, abilities).

### 🧰 Tools & Calculators
- **🧬 Breeding Planner**: Advanced calculator to determine the most efficient path for breeding 2x31, 3x31, or 5x31 competitive Pokémon, complete with cost visualization.
- **🧮 Catch Calculator**: Real-time probability calculator supporting all ball types, status conditions, HP percentages, and special ball mechanics (Dream, Nest, Timer Ball).
- **🔄 Trainer Reruns**: Optimized routes for Gym Runs and Trainer Reruns to maximize money making, including requirements and tips.
- **📦 Pickup Guide**: searchable data on pickup items by region and location.
- **📚 Pokédex**: Fast, filterable database of Pokémon with sprites and basic info.

### ⚡ Technical Features
- **📱 Mobile-First Design**: Clean, responsive interface that works perfectly on any device.
- **✏️ Advanced Local CMS**: A radically improved "Editor" page allowing contributors to modify JSON data files (Strategies, Pokedex, etc.) via a rich UI with drag-and-drop support, smart inputs, and validation — running on a local Express backend.

---

## ⚡ Status

![React](https://img.shields.io/badge/React-19.2.1-00d8ff?logo=react&logoColor=white&style=flat)
![Vite](https://img.shields.io/badge/Vite-7.2.6-646CFF?logo=vite&logoColor=white&style=flat)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-06B6D4?logo=tailwindcss&logoColor=white&style=flat)
![React Router](https://img.shields.io/badge/React_Router-7.10.1-CA4245?logo=react-router&logoColor=white&style=flat)
![dnd-kit](https://img.shields.io/badge/dnd--kit-6.3.1-007bff?style=flat)
![License](https://img.shields.io/badge/License-Unlicense-blue)

---

## 📸 Screenshots

### 🌐 Application Overview

#### 🏠 Landing Page
![Homepage Screenshot](./screenshots/homepage.png)

#### 🏆 Elite Four Strategies
![Elite Four Section Screenshot](./screenshots/elite-four-section.png)
_Interactive decision trees for every turn of the battle._
![Elite Four Strategy Tree](./screenshots/elite-four-strategy-tree-section.png)

#### 🧬 Breeding Planner
![Breeding Section Screenshot](./screenshots/breeding-section.png)

#### ✏️ Strategy Editor (CMS)
![Editor Section Screenshot](./screenshots/editor-section.png)
_A powerful local editor for managing game data without touching JSON directly._

#### ⚔️ Boss Fights (Red)
![Red Section Screenshot](./screenshots/red-section.png)

---

## 📁 Project Structure

```bash
/
├── dist/               # Production build output
├── public/             # Static assets (images, icons)
├── server/             # Local backend for data editing
│   └── server.js       # Express server (runs on port 3001)
├── src/
│   ├── app/            # Core app logic
│   │   ├── App.jsx     # Main component & routing logic
│   │   ├── index.css   # Global styles & Tailwind directives
│   │   └── layout/     # Layout components (Navbar, Home, Shell)
│   ├── data/           # JSON data files (The "Database")
│   │   ├── bossFightsData.json
│   │   ├── eliteFourData.json
│   │   ├── pickupData.json
│   │   ├── pokedex.json
│   │   ├── raidsData.json
│   │   ├── superTrainersData.json
│   │   └── trainerRerunData.json
│   ├── pages/          # Feature-specific pages
│   │   ├── boss-fights/      # Strategies for Bosses
│   │   ├── breeding/         # Breeding Calculator
│   │   ├── catch-calculator/ # Catch Rate Calculator
│   │   ├── editor/           # CMS interface for editing JSON data
│   │   ├── elite-four/       # Elite Four Strategies
│   │   ├── pickup/           # Pickup Item Guide
│   │   ├── pokedex/          # Pokémon Database Viewer
│   │   ├── raids/            # Raid Battle Strategies
│   │   ├── super-trainers/   # Super Trainer Strategies
│   │   └── trainer-rerun/    # Gym Run / Money Making Routes
│   └── shared/         # Reusable components and utilities
│       ├── components/ # Generic UI components
│       ├── hooks/      # Custom React hooks
│       └── utils/      # Helper functions
├── .prettierrc         # Prettier configuration
├── eslint.config.js    # ESLint configuration
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (v9+) or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SolaneHub/PokeMMO-Compendium.git
    cd PokeMMO-Compendium
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running Development Environment

To start the **React Frontend** and the **Express Backend** (for the Editor) concurrently:

```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

> **Note:** The backend is only required if you intend to use the **Editor** page to modify data files.

### Building for Production

```bash
npm run build
```

This compiles the application into the `dist/` directory, ready for deployment.

### Linting & Formatting

```bash
npm run lint         # Check for code quality issues
npm run lint:fix     # Auto-fix issues
npm run format       # Format code with Prettier
```

---

## 💡 Inspiration & Credits

This compendium is a community-driven effort to aggregate knowledge for **PokéMMO** players.

- **Breeding & Pokédex**: Inspired by concepts from [PokéMMO Hub](https://pokemmohub.com/).
- **Elite Four, Red & Ho-Oh**: Strategies adapted from [Team Porygon](https://team-porygon-pokemmo.pages.dev/guides/EliteFour) and [PokeKing](http://pokeking.icu/).
- **Raids**: Based on content from the [caav](https://www.youtube.com/@caav.pokemmo) YouTube Channel.
- **Pickup**: Data sourced from [PokéMMO ShoutWiki](https://pokemmo.shoutwiki.com/).

---

## ©️ License

This project is released under the **[Unlicense](http://unlicense.org/)**.
It is free and unencumbered software released into the public domain. You can copy, modify, publish, use, sell, or distribute this software for any purpose, commercial or non-commercial.
