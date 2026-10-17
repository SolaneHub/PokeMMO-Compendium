import { Pokemon, PokemonMove } from "@/types/pokemon";

/**
 * Propagates moves from a base Pokemon to its evolutionary descendants.
 * Preserves original move levels, overwrites existing moves with base data,
 * retains unique evolution moves, and avoids infinite loops.
 */
export const propagateMovesToEvolutions = (
  basePokemon: Pokemon,
  allPokemon: Pokemon[],
  visited: Set<string> = new Set()
): Pokemon[] => {
  const baseName = basePokemon.name.toLowerCase().trim();
  if (!baseName || visited.has(baseName)) return [];
  visited.add(baseName);

  if (!basePokemon.evolutions || basePokemon.evolutions.length === 0) return [];

  const baseMoves = (basePokemon.moves || []).map(({ name, ...rest }) => ({
    name,
    ...rest,
  }));

  const updates: Pokemon[] = [];

  basePokemon.evolutions.forEach((evo) => {
    const evoPokemon = allPokemon.find(
      (p) => p.name.toLowerCase().trim() === evo.name.toLowerCase().trim()
    );

    if (evoPokemon) {
      const evoName = evoPokemon.name.toLowerCase().trim();
      if (visited.has(evoName)) return;

      const newMovesList: PokemonMove[] = [];
      const evolutionExistingMoves = [...(evoPokemon.moves || [])];

      baseMoves.forEach((bm) => {
        const existingMoveInEvoIdx = evolutionExistingMoves.findIndex(
          (m) => m.name.toLowerCase().trim() === bm.name.toLowerCase().trim()
        );

        if (existingMoveInEvoIdx === -1) {
          newMovesList.push({ ...bm });
        } else {
          newMovesList.push({ ...bm });
          evolutionExistingMoves.splice(existingMoveInEvoIdx, 1);
        }
      });

      newMovesList.push(...evolutionExistingMoves);

      const isDifferent =
        JSON.stringify(evoPokemon.moves) !== JSON.stringify(newMovesList);

      const updatedEvo: Pokemon = { ...evoPokemon, moves: newMovesList };
      if (isDifferent) {
        updates.push(updatedEvo);
      }

      updates.push(
        ...propagateMovesToEvolutions(updatedEvo, allPokemon, visited)
      );
    }
  });

  const uniqueUpdates: Record<string, Pokemon> = {};
  updates.forEach((p) => {
    if (p.id) uniqueUpdates[p.id.toString()] = p;
  });

  return Object.values(uniqueUpdates);
};
