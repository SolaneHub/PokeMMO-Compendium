# 🛠️ Useful Commands for PokeMMO Compendium

This file summarizes the main commands for development, testing, and deployment of the project.

## 🚀 Local Development

These commands are used to work on the project on your computer.

| Command       | Description                                                                                                    |
| :------------ | :------------------------------------------------------------------------------------------------------------- |
| **`pnpm dev`** | **Start the application.** Launches the frontend (Vite) in development mode.                                   |
| `pnpm preview` | Simulates the production build locally. Useful for checking that the site works correctly before deployment.   |

## ✨ Code Quality

Use these commands to keep the code clean and organized.

| Command        | Description                                                     |
| :------------- | :-------------------------------------------------------------- |
| **`pnpm lint`** | Checks for code errors (ESLint rules).                          |
| `pnpm lint:fix` | Checks for errors and tries to **fix them automatically**.      |
| `pnpm format`   | Formats all code (spaces, commas, etc.) using Prettier.         |

## 🌐 Site Deployment (Firebase Hosting)

Deployment is automated via GitHub Actions on the `production` branch.

| Command      | Description                                                                                                                   |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------- |
| `pnpm build` | Compiles the project into the `dist/` folder without publishing. Also creates the `404.html` page required for routing.        |

## 🔥 Database (Firebase)

Commands to manage the database and security rules.

| Command                                | Description                                                                                    |
| :------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **`firebase deploy --only firestore`** | Publishes **security rules** (`firestore.rules`) and indexes (`firestore.indexes.json`) to Firebase. |

## 🔍 SonarCloud (Code Quality)

Commands and processes to monitor code quality and technical debt.

| Command               | Description                                                                                                   |
| :-------------------- | :------------------------------------------------------------------------------------------------------------ |
| **`pnpm sonar:report`** | **Generate local report.** Downloads open issues from SonarCloud and creates the `sonar-full-report.md` file. |
| `CI (GitHub Actions)` | **Automatic analysis.** Every Pull Request and push to `main` starts a SonarCloud analysis to verify Quality Gates. |

---

### 📝 Important Notes

- **Routing on GitHub Pages:** The project is configured to handle SPA routing on GitHub Pages by automatically creating a `404.html` file during the build.
