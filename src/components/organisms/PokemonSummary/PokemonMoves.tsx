import { useState } from "react";

import { PokemonType, typeBackgrounds } from "@/utils/pokemonColors";

interface Move {
  level?: string | number;
  name: string;
  type?: string;
  category?: string;
  cat?: string;
  power?: string | number;
  pwr?: string | number;
  accuracy?: string | number;
  acc?: string | number;
  pp?: string | number;
}

interface PokemonMovesProps {
  moves: Move[];
}

const PokemonMoves = ({ moves }: PokemonMovesProps) => {
  const [moveSearch, setMoveSearch] = useState("");
  const filteredMoves = (() => {
    if (!moves) return [];
    if (!moveSearch) return moves;
    return moves.filter((m) =>
      m.name.toLowerCase().includes(moveSearch.toLowerCase())
    );
  })();

  return (
    <div className="flex flex-col gap-2.5 text-white">
      <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-2">
        <h4 className="m-0 border-none p-0 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Level Up Moves
        </h4>
        <input
          type="text"
          className="w-44 rounded-md border border-white/10 bg-[#0f1014] px-3 py-1.5 text-sm text-white transition-all outline-none placeholder:text-slate-600 placeholder:italic focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          placeholder="Search move..."
          value={moveSearch}
          onChange={(e) => setMoveSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0f1014]">
        <div className="sticky top-0 z-1 flex border-b border-white/5 bg-white/5 p-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          <span className="w-10 text-center">LVL</span>
          <span className="flex-1 text-center">MOVE</span>
          <span className="w-16 text-center">TYPE</span>
          <span className="w-12 text-center">CAT</span>
          <span className="w-10 text-center">PWR</span>
          <span className="w-10 text-center">PP</span>
          <span className="w-10 text-center">ACC</span>
        </div>
        {filteredMoves.length > 0 ? (
          filteredMoves.map((move, i) => {
            const moveType = (move.type || "") as PokemonType;
            const typeBg = typeBackgrounds[moveType] || typeBackgrounds[""];
            const moveCat = move.cat || move.category || "";

            return (
              <div
                key={i}
                className="flex items-center border-b border-white/5 p-2 transition-colors last:border-b-0 hover:bg-white/10"
              >
                <div className="w-10 text-center">
                  <span className="font-mono text-sm font-bold text-slate-400">
                    {move.level}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center text-center">
                  <span className="text-sm leading-tight font-semibold">
                    {move.name}
                  </span>
                </div>
                <div className="flex w-16 justify-center">
                  <span
                    className="w-14 rounded-sm px-1.5 py-0.5 text-center text-[8px] font-bold text-white uppercase shadow-sm"
                    style={{ background: typeBg }}
                  >
                    {move.type}
                  </span>
                </div>
                <div className="flex w-12 justify-center">
                  <span
                    className={`w-10 rounded-sm py-0.5 text-center text-[8px] font-bold text-neutral-900 uppercase ${
                      moveCat === "Physical"
                        ? "bg-orange-400"
                        : moveCat === "Special"
                          ? "bg-sky-400"
                          : "bg-neutral-400"
                    }`}
                  >
                    {moveCat.substring(0, 4) || "-"}
                  </span>
                </div>
                <div className="w-10 text-center text-sm">
                  {move.pwr || move.power || "-"}
                </div>
                <div className="w-10 text-center text-sm">{move.pp || "-"}</div>
                <div className="w-10 text-center text-sm">
                  {move.acc || move.accuracy || "-"}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-5 text-center text-sm text-slate-400 italic">
            No moves found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonMoves;
