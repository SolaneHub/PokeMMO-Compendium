import { useEffect, useRef, useState } from "react";

import ItemImage from "@/components/atoms/ItemImage";
import { getPokemonCardData } from "@/services/pokemonService";
import { Pokemon } from "@/types/pokemon";
import { RaidBuild } from "@/types/raids";

interface PlayerBuildCardProps {
  build: RaidBuild;
  pokemonMap: Map<string, Pokemon>;
}

const MarqueeText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [scrollDist, setScrollDist] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.scrollWidth;
        if (textWidth > containerWidth) {
          setScrollDist(containerWidth - textWidth - 8); // 8px buffer
        } else {
          setScrollDist(0);
        }
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden whitespace-nowrap ${className}`}
    >
      <span
        ref={textRef}
        className={`inline-block ${
          scrollDist < 0 ? "animate-[marquee_6s_ease-in-out_infinite]" : ""
        }`}
        style={{ "--scroll-x": `${scrollDist}px` } as React.CSSProperties}
      >
        {children}
      </span>
    </div>
  );
};

const BuildDetails = ({
  build,
  pokemonMap,
}: {
  build: RaidBuild;
  pokemonMap: Map<string, Pokemon>;
}) => {
  if (!build || !build.name) return null;
  const { sprite } = getPokemonCardData(build.name, pokemonMap);

  return (
    <>
      <div className="flex items-center justify-between bg-white/5 p-2.5">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={sprite || undefined}
            alt={build.name}
            className="h-10 w-10 shrink-0 object-contain drop-shadow-md"
          />
          <span className="truncate text-sm font-bold">{build.name}</span>
        </div>
        {build.item && (
          <span className="ml-2 flex shrink-0 items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
            <ItemImage
              item={build.item}
              className="mr-1.5 h-5 w-5 object-contain"
            />
            {build.item}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-white/2 px-3 py-2 text-xs">
        {/* Row 1: Nature and EVs */}
        <div className="flex min-w-0 gap-1.5 overflow-hidden">
          <span className="shrink-0 font-bold text-slate-500 uppercase">
            Nat:
          </span>
          <MarqueeText className="font-semibold text-slate-200">
            {build.nature || "—"}
          </MarqueeText>
        </div>
        <div className="flex min-w-0 gap-1.5 overflow-hidden">
          <span className="shrink-0 font-bold text-slate-500 uppercase">
            EVs:
          </span>
          <MarqueeText className="font-semibold text-slate-200">
            {build.evs || "—"}
          </MarqueeText>
        </div>

        {/* Row 2: IVs and Ability */}
        <div className="flex min-w-0 gap-1.5 overflow-hidden">
          <span className="shrink-0 font-bold text-slate-500 uppercase">
            IVs:
          </span>
          <MarqueeText className="font-semibold text-slate-200">
            {build.ivs || "—"}
          </MarqueeText>
        </div>
        <div className="flex min-w-0 gap-1.5 overflow-hidden">
          <span className="shrink-0 font-bold text-slate-500 uppercase">
            Ab:
          </span>
          <MarqueeText className="font-semibold text-slate-200">
            {build.ability || "—"}
          </MarqueeText>
        </div>
      </div>

      {build.moves && build.moves.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-white/5 bg-[#0f1014] p-2.5">
          {build.moves.map((m, k) => (
            <span
              key={k}
              className="rounded border border-white/5 bg-white/5 px-1.5 py-0.5 text-xs font-medium text-slate-300"
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

const PlayerBuildCard = ({ build, pokemonMap }: PlayerBuildCardProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!build) return null;

  const options = [build, ...(build.variants || [])].filter(
    (opt) => opt && opt.name
  );

  if (options.length === 0) return null;

  const activeBuild = options[selectedIndex] || options[0];

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-white/5 bg-[#0f1014] text-white shadow-sm transition-colors hover:border-white/20">
      {options.length > 1 && (
        <div className="flex flex-wrap gap-1 border-b border-white/5 bg-black/20 p-1.5">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-1 cursor-pointer rounded px-2 py-1 text-center text-[10px] font-bold uppercase transition-all ${
                selectedIndex === idx
                  ? "bg-blue-600/30 text-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
      <BuildDetails build={activeBuild} pokemonMap={pokemonMap} />
    </div>
  );
};

export default PlayerBuildCard;
