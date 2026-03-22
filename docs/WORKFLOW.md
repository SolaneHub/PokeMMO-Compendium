# 🔄 Workflow and Versioning

This document describes the standards for using GitHub Labels and the versioning strategy for the PokeMMO Compendium project.

## 🏷️ GitHub Labels

We use a structured labeling system to classify Issues and Pull Requests.

### 🧩 Type
Indicates the nature of the change.
- `Type: Bug`: Something isn't working as expected.
- `Type: Feature`: A new feature or improvement.
- `Type: Docs`: Improvements to documentation.
- `Type: Refactor`: Code changes that do not affect behavior (cleanup, optimization).
- `Type: Test`: Adding or correcting tests.
- `Type: Chore`: Maintenance tasks (dependencies, build, configurations).
- `Type: UX/UI`: Visual or user experience changes.
- `Type: Performance`: Performance improvements.
- `Type: Security`: Vulnerability fixes.

### 🚥 Status
Indicates the progress of the task.
- `Status: Triage`: New issue, awaiting evaluation.
- `Status: In Progress`: Currently being worked on.
- `Status: Review`: Work completed, awaiting review (PR open).
- `Status: Blocked`: Blocked by external factors or dependencies.
- `Status: On Hold`: Intentionally paused for the future.
- `Status: Duplicate`: Already exists.
- `Status: Wontfix`: Will not be implemented.

### ⚡ Priority
Indicates the urgency of the task.
- `Priority: Critical`: Urgent, blocks the main flow.
- `Priority: High`: Must be fixed in the next release.
- `Priority: Medium`: Important, but does not block work.
- `Priority: Low`: Optional, to be done when possible.

### 📏 Size
Estimate of the effort required.
- `Size: XS`: A few minutes.
- `Size: S`: A few hours.
- `Size: M`: One or two days.
- `Size: L`: Complex task.
- `Size: XL`: Massive refactor or huge feature.

---

## 🤖 Automation

The project uses GitHub Actions to automate the workflow.

### 🏷️ Automatic Labeling
When a Pull Request is opened, the **Pull Request Labeler** workflow automatically assigns labels based on the modified files:
- Files in `src/components/` or `src/pages/` → `Type: UX/UI`
- `.md` files or in `docs/` → `Type: Docs`
- Changes to `package.json`, workflows, or configurations → `Type: Chore`
- Test files (`.test.ts`) → `Type: Test`

### 📝 Release Drafting
The **Release Drafter** workflow automatically manages the draft of the next release:
- Categorizes changes based on PR labels.
- Calculates the next version number (SemVer) based on merged changes.
- Generates a detailed changelog with links to PRs and authors.

---

## 🔢 Versioning (SemVer)

We follow [Semantic Versioning (SemVer)](https://semver.org/). The format is `MAJOR.MINOR.PATCH`.

- **PATCH** (x.y.z+1): Backward-compatible bug fixes.
- **MINOR** (x.y+1.0): Backward-compatible new features.
- **MAJOR** (x+1.0.0): Changes that break backward compatibility (Breaking Changes).

### 🚀 Release Process
1.  **Changelog**: Update documentation if necessary.
2.  **Tagging**: Create a Git tag with the version (e.g., `v1.2.0`).
3.  **Release**: Create a release on GitHub based on the tag, describing the main updates.
