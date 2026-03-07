import TypeBadge from "@/components/atoms/TypeBadge";
import { BaseStats } from "@/types/pokemon";
import { PokemonType } from "@/utils/pokemonColors";

interface PokemonStatsProps {
  stats: BaseStats;
  defenses: Record<string, number> | null;
}

const PokemonStats = ({ stats, defenses }: PokemonStatsProps) => {
  const statOrder: (keyof BaseStats)[] = [
    "hp",
    "atk",
    "def",
    "spa",
    "spd",
    "spe",
  ];

  const getTypesByMultiplier = (mult: number) => {
    if (!defenses) return [];
    return Object.entries(defenses)
      .filter(([, val]) => val === mult)
      .map(([type]) => type as PokemonType);
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Base Stats */}
      <div className="flex flex-col gap-2.5">
        <h4 className="border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Base Stats
        </h4>
        {stats &&
          statOrder.map((key) => {
            const val = stats[key];
            if (val === undefined) return null;
            const barWidth = `${Math.min((val / 255) * 100, 100)}%`;
            let barColor = "#f87171";
            if (val > 100) {
              barColor = "#00b894";
            } else if (val > 60) {
              barColor = "#2563EB";
            }

            return (
              <div key={key} className="flex items-center gap-3">
                <span className="w-8 text-[10px] font-bold text-slate-500 uppercase">
                  {key}
                </span>
                <span className="w-8 text-right font-mono text-sm font-bold">
                  {val}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0f1014]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: barWidth,
                      background: barColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {/* Weakness & Resistance */}
      <div className="mt-5 flex flex-col gap-2.5">
        <h4 className="border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Weakness & Resistance
        </h4>
        {!defenses ? (
          <p className="p-5 text-center text-slate-400 italic">
            Type data not available.
          </p>
        ) : (
          <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
            {[4, 2, 0.5, 0.25, 0].map((mult) => {
              const types = getTypesByMultiplier(mult);
              if (types.length === 0) return null;

              const label = mult === 0.25 ? "¼x" : `${mult}x`;
              let colorClass = "text-emerald-400";
              if (mult > 1) {
                colorClass = "text-red-400";
              } else if (mult === 0) {
                colorClass = "text-purple-400";
              }

              return (
                <div key={mult} className="flex items-center gap-3">
                  <span
                    className={`w-9 shrink-0 text-right text-sm font-bold ${colorClass}`}
                  >
                    {label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {types.map((t) => (
                      <TypeBadge key={t} type={t} size="xs" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonStats;
