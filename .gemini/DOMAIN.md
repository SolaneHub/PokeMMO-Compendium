# PokéMMO Domain Knowledge & Business Logic

## Core Terminology

- **IVs (Individual Values)**: Hidden stats (0-31) that determine a Pokémon's potential. Max is 31 (e.g., "31/31/31").
- **EVs (Effort Values)**: Stats gained from battling (up to 510 total, max 252 per stat).
- **Natures**: Modifiers (+10% / -10%) to stats (e.g., Adamant, Modest, Jolly).
- **Abilities**: Special passive effects (e.g., Intimidate, Sturdy).
- **Items**: Held items (e.g., Choice Band, Leftovers) or consumables (e.g., Master Ball).

## PokéMMO Specifics (vs. Mainline Games)

- **Breeding**: In PokéMMO, breeding _consumes_ the parents. This is a "sacrifice-based" system.
- **Gym Leader Re-runs**: Daily activities to earn money by defeating Gym Leaders.
- **Alpha Pokémon**: Special, stronger Pokémon with fixed high IVs (usually 2x31 or 1x31).
- **Boss Fights**: High-difficulty encounters (E4, Red, etc.) with custom AI and teams.
- **Regions**: Kanto, Johto, Hoenn, Sinnoh, Unova. Each has its own Pokedex and progression.

## Application-Specific Logic

- **Catch Calculator**: Calculates catch probability based on HP, Status, Ball Type, and PokéMMO-specific rates.
- **Breeding Calculator**: Guides the user on how to reach a specific "IV build" (e.g., a "5x31" Pokémon).
- **Team Builder**: Allows users to save and share their PokéMMO teams, including movesets and items.
- **Pickup**: A mechanic where certain Pokémon (with the "Pickup" ability) find items after battles.

## Firebase Collections

- `teams`: User-created teams.
- `pokedex`: Public Pokémon data (stats, moves, types).
- `boss_fights`: Data for elite four and special bosses.
- `users`: User profiles and settings.
