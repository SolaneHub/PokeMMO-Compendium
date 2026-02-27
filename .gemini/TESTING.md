# Testing & Validation Workflow

## Validation Mandate

Before considering any code change "complete," the following checks MUST pass:

1.  **TypeScript Check**: `npm run type-check` (runs `tsc --noEmit`). No type errors are allowed.
2.  **Linting**: `npm run lint` (runs `eslint .`). All ESLint warnings and errors must be resolved.
3.  **Style Linting**: `npm run lint:style` (runs `stylelint "src/**/*.css"`). Ensures Tailwind 4 and CSS best practices.
4.  **Formatting**: `npm run format:check` (runs `prettier --check`). The project must adhere to Prettier rules.

## Comprehensive Validation

You can run the full suite using:

```bash
npm run validate
```

**Note**: If any check fails, do not ask the user for permission to fix it. Fix the code until `npm run validate` passes successfully.

## Manual Testing (Development)

During implementation, start the development server to verify the UI:

```bash
npm run dev
```

- **URL**: `http://localhost:5173`
- **Feedback Loop**: Check for console errors or broken layouts after each significant change.

## Build Check

For larger architectural changes, run a build to ensure no production-only issues:

```bash
npm run build
```
