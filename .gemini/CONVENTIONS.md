# Coding & Project Conventions

## Component Structure (Atomic Design)

Follow the atomic structure rigorously to ensure modularity and reuse.

- **Atoms**: Smallest building blocks (e.g., `Button`, `Input`, `StatCircle`, `TypeBadge`).
- **Molecules**: Groups of atoms working together (e.g., `SearchBar`, `InfoCard`, `PokemonSpriteCircle`).
- **Organisms**: Complex components that form sections of a page (e.g., `PokemonGrid`, `TeamCard`, `StrategyModal`).
- **Templates**: Page layouts or structural shells.
- **Pages**: Top-level components for specific routes (defined in `src/pages/`).

## Naming Rules

- **Components**: PascalCase (e.g., `PokemonCard.tsx`).
- **Hooks**: `use` prefix, camelCase (e.g., `usePokedexData.ts`).
- **Services/Utils**: camelCase (e.g., `pokemonService.ts`).
- **Types/Interfaces**: PascalCase (e.g., `Pokemon`, `TeamBuild`). Do not use the `I` prefix.
- **Folders**: kebab-case or feature-based camelCase.

## TypeScript Style

- **Strict Mode**: Enable and respect strict typing.
- **Interfaces over Types**: Use `interface` for object shapes, `type` for unions or aliases.
- **Explicit Returns**: Explicitly type function return values, especially for hooks and services.

## Styling (Tailwind CSS 4)

- Use Tailwind 4 utility classes for all styling.
- **Utility-First**: Avoid custom CSS in `index.css` unless it's a global theme variable or a complex animation that Tailwind can't handle.
- **Consistency**: Use the colors defined in `docs/COLORS.md`.

## React Best Practices

- **Functional Components**: Use arrow functions for components.
- **Hooks**: Keep logic out of components as much as possible by using custom hooks.
- **Context API**: Use contexts for global state (Auth, Toast, Confirmation) to avoid prop drilling.
