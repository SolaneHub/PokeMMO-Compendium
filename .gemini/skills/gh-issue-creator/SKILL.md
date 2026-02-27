---
name: gh-issue-creator
description: Create or Edit GitHub issues with strict naming conventions, project assignment, and milestone tracking. Use when the user wants to report a bug, suggest a feature, or track a task.
---

# GitHub Issue Creator

This skill provides a standardized workflow for creating and editing GitHub issues within the PokeMMO-Compendium repository.

## Overview

All issues must follow a specific naming pattern and be automatically assigned to the project and the current active milestone.

## Dynamic Data Discovery

Before creating or editing an issue, always use these commands to ensure you have the correct and latest information:

1.  **Labels**: Check existing labels to match the correct `Type: <Label>` or `Priority: <Label>`.
    ```powershell
    gh label list
    ```
2.  **Milestones**: Fetch the exact title or ID of the active milestone.
    ```powershell
    gh api repos/:owner/:repo/milestones --jq '.[] | {title, number}'
    ```
3.  **Projects**: Identify the exact title of the Project (ProjectV2) to be used with `--add-project`.
    ```powershell
    gh project list --owner <username/org>
    ```

## Strict Rules

1.  **Title Format**: `[TYPE] Title`
    - `[Bug]`: For unexpected behavior.
    - `[Feature]`: For new functionality.
    - `[Test]`: For adding/fixing tests.
    - `[Refactor]`: For code quality improvements.
    - `[Docs]`: For documentation tasks.
2.  **Standard Assignment**:
    - **Project**: `"PokeMMO-Compendium Tasks"`.
    - **Milestone**: `"v1.1 - Refactoring & Performance"`.

## Workflow

### 1. Create a New Issue

```powershell
gh issue create --title "[TYPE] TITLE" --body "BODY" --label "LABEL" --project "PokeMMO-Compendium Tasks" --milestone "v1.1 - Refactoring & Performance"
```

### 2. Edit an Existing Issue

```powershell
gh issue edit <ID> --title "[TYPE] TITLE" --add-project "PokeMMO-Compendium Tasks" --milestone "v1.1 - Refactoring & Performance"
```

## Example Usage

**User**: "Apri una issue per i test unitari."

**AI Action**:

1. Run `gh label list` to find `Type: Test`.
2. Run `gh issue create --title "[Test] Setup Unit Tests" --body "..." --label "Type: Test" --project "PokeMMO-Compendium Tasks" --milestone "v1.1 - Refactoring & Performance"`

## Best Practices

- Always provide the resulting issue URL to the user.
- If a project or milestone is missing, use the discovery commands to find alternatives or report to the user.
