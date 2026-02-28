---
name: gh-workflow-manager
description: Manage GitHub issues, branches, and PRs. Use to list issues, create branches for specific issues, and create Pull Requests (Merge Requests) upon task completion.
---

# GitHub Workflow Manager

This skill automates the full development cycle: identifying tasks through issues, creating dedicated feature branches, and submitting Pull Requests.

## Discovery Phase

Before starting a new task, always check for existing issues to ensure work is tracked.

1.  **List Active Issues**:
    ```powershell
    gh issue list --limit 10
    ```
2.  **View Issue Details**:
    ```powershell
    gh issue view <issue-number>
    ```

## Step 1: Branching Strategy

If a relevant issue is found, use its number to name the branch.

1.  **Create Issue Branch**:

    ```powershell
    git checkout -b issue-<number>-<slugified-description>
    ```

    _Example: `git checkout -b issue-42-add-login-form`_

2.  **No Issue Found?**:
    If no issue exists, ask the user if they'd like you to create one first using the `gh-issue-creator` skill.

## Step 2: Implementation

Perform the requested changes on the newly created branch.

### 2a: Import Aliasing & Linting

Before finalizing the implementation, ensure all imports use the `@/` alias and the code follows the project's styling rules.

1.  **Replace Relative Imports**:
    Convert all `../` and `./` imports to use the `@/` alias.
2.  **Auto-Fix Linting**:
    ```powershell
    npm run lint:fix
    ```
3.  **Validate Changes**:
    ```powershell
    npm run validate
    ```

## Step 3: Pull Request (Merge Request) Creation

When the user indicates that the task is finished, follow this sequence:

1.  **Final Validation**:
    ALWAYS run the full validation pipeline and all tests to ensure the workspace is in a perfect state.
    ```powershell
    npm run validate
    npm run test:run
    ```
2.  **Format Code**:
    ALWAYS run the project's formatter before staging changes.
    ```powershell
    npm run format
    ```
3.  **Commit Changes**:
    Stage all changes and commit with a clear, concise message.
    ```powershell
    git add .
    git commit -m "<type>: <description>"
    ```
4.  **Push Branch**:
    ```powershell
    git push origin <branch-name>
    ```
5.  **Create PR**:
    ```powershell
    gh pr create --title "[PR] <Title from Issue>" --body "Closes #<number>" --label "Type: <Label>" --project "PokeMMO-Compendium Tasks" --milestone "v1.1 - Refactoring & Performance"
    ```

## Strict Rules

1.  **Integrity**: NEVER commit or create a PR if `npm run validate` or `npm run test:run` fails. Fix all errors first.
2.  **Formatting**: NEVER commit without running `npm run format` first.
3.  **Language**: All issues, branch names, commit messages, and PR descriptions MUST be in **English**.
4.  **Branch Persistence**: Never delete branches unless explicitly asked.
5.  **Linking**: Always include `Closes #<number>` in the PR body to automatically close the issue upon merge.
6.  **Naming**: PR titles must follow the `[PR] <Description>` format.

## Example Workflow

**User**: "Implement pokemon search."

**AI Action**:

1. `gh issue list` -> Found Issue #5: "Search Pokemon by Name".
2. `git checkout -b issue-5-pokemon-search`
3. [Implement search feature]
4. **User**: "I'm done."
5. `npm run validate`
6. `npm run test:run`
7. `npm run format`
8. `git add .`, `git commit -m "feat: implement pokemon search"`, `git push origin issue-5-pokemon-search`
9. `gh pr create --title "[PR] Search Pokemon by Name" --body "Closes #5" ...`
