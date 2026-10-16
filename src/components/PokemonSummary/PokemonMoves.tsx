import { useState } from "react";

import { PokemonMove } from "@/types/pokemon";
import { PokemonType, typeBackgrounds } from "@/utils/pokemonColors";

interface PokemonMovesProps {
  moves: PokemonMove[];
}

const getCategoryStyles = (cat: string) => {
  if (cat === "Physical") return "bg-orange-500 text-white";
  if (cat === "Special") return "bg-sky-500 text-white";
  return "bg-slate-600 text-slate-200";
};

const PokemonMoves = ({ moves }: PokemonMovesProps) => {
  const [moveSearch, setMoveSearch] = useState("");

  const filteredMoves = (() => {
    if (!moves) return [];
    if (!moveSearch) return moves;
    return moves.filter((m) =>
      m.name.toLowerCase().includes(moveSearch.toLowerCase())
    );
  })();

  // Optimized grid template: strictly defined widths for technical data
  // Min-width for entire table container to prevent columns from breaking on mobile
  const gridTemplate = "grid-cols-[65px_1fr_80px_60px_70px_50px_50px]";
  const minTableWidth = "min-w-[450px]";

  return (
    <div className="flex flex-col gap-2.5 text-white">
      <div className="mb-2 flex flex-col justify-between gap-2 border-b border-white/5 pb-2 sm:flex-row sm:items-center">
        <h4 className="m-0 border-none p-0 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Level Up Moves
        </h4>
        <input
          type="text"
          className="w-full rounded-md border border-white/10 bg-[#0f1014] px-3 py-1.5 text-xs text-white transition-all outline-none placeholder:text-slate-600 placeholder:italic focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 sm:w-44"
          placeholder="Search move..."
          value={moveSearch}
          onChange={(e) => setMoveSearch(e.target.value)}
        />
      </div>

      {/* Horizontal Scroll Container for Mobile */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0f1014]">
        <div className="scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent max-h-[500px] overflow-x-auto overflow-y-auto">
          <div className={minTableWidth}>
            {/* Header */}
            <div
              className={`sticky top-0 z-20 grid ${gridTemplate} items-center justify-items-center border-b border-white/10 bg-[#16181d] px-3 py-2 text-[9px] font-black tracking-wider text-slate-400 uppercase`}
            >
              <div>LVL</div>
              <div>MOVE</div>
              <div>TYPE</div>
              <div>CAT</div>
              <div>PWR</div>
              <div>PP</div>
              <div>ACC</div>
            </div>

            {/* Rows */}
            <div className="flex flex-col">
              {filteredMoves.length > 0 ? (
                filteredMoves.map((move, i) => {
                  const moveType = (move.type || "") as PokemonType;
                  const typeBg =
                    typeBackgrounds[moveType] || typeBackgrounds[""];
                  const rawMove = move as Record<string, unknown>;
                  const moveCat =
                    (move.category as string | undefined) ||
                    (rawMove["cat"] as string | undefined) ||
                    "";
                  const movePwr =
                    move.power ??
                    (rawMove["pwr"] as string | number | undefined) ??
                    "---";
                  const moveAcc =
                    move.accuracy ??
                    (rawMove["acc"] as string | number | undefined) ??
                    "---";
                  const moveLvl = move.level ?? 0;

                  return (
                    <div
                      key={`${move.name}-${i}`}
                      className={`grid ${gridTemplate} items-center justify-items-center border-b border-white/5 px-3 py-2 transition-colors last:border-b-0 hover:bg-white/5`}
                    >
                      {/* LVL */}
                      <div className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                        {moveLvl}
                      </div>

                      {/* MOVE */}
                      <div className="w-full min-w-0 px-2 text-center">
                        <span className="block truncate text-sm font-bold text-slate-100">
                          {move.name}
                        </span>
                      </div>

                      {/* TYPE */}
                      <div>
                        <span
                          className="inline-block w-16 rounded-sm py-0.5 text-center text-[8px] font-black text-white uppercase shadow-sm"
                          style={{ background: typeBg }}
                        >
                          {move.type}
                        </span>
                      </div>

                      {/* CAT */}
                      <div>
                        <span
                          className={`inline-block w-10 rounded-sm py-0.5 text-center text-[8px] font-black uppercase ${getCategoryStyles(moveCat)}`}
                        >
                          {moveCat.substring(0, 4) || "-"}
                        </span>
                      </div>

                      {/* PWR */}
                      <div className="text-center font-mono text-xs whitespace-nowrap text-slate-300">
                        {movePwr}
                      </div>

                      {/* PP */}
                      <div className="text-center font-mono text-xs text-slate-300">
                        {move.pp || "-"}
                      </div>

                      {/* ACC */}
                      <div className="text-center font-mono text-xs text-slate-300">
                        {moveAcc}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center text-sm text-slate-500 italic">
                  No moves found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonMoves;
