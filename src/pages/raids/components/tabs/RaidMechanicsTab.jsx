const RaidMechanicsTab = ({ currentRaid }) => {
  if (!currentRaid.mechanics) return <div />;

  return (
    <section className="flex flex-col gap-4 rounded-lg bg-neutral-800 p-3">
      <div>
        <h3 className="mb-2 text-xs font-bold tracking-widest text-slate-200 uppercase">
          Boss Info
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {currentRaid.mechanics.ability && (
            <div className="flex flex-col gap-1 rounded-lg border border-slate-700 bg-neutral-900 p-2.5">
              <strong className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Ability
              </strong>
              <span className="text-sm text-slate-200">
                {currentRaid.mechanics.ability}
              </span>
            </div>
          )}
          {currentRaid.mechanics.heldItem && (
            <div className="flex flex-col gap-1 rounded-lg border border-slate-700 bg-neutral-900 p-2.5">
              <strong className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Item
              </strong>
              <span className="text-sm text-slate-200">
                {currentRaid.mechanics.heldItem}
              </span>
            </div>
          )}
          {currentRaid.mechanics.notes && (
            <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-slate-700 bg-neutral-900 p-2.5">
              <strong className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Notes
              </strong>
              <span className="text-sm text-slate-200">
                {currentRaid.mechanics.notes}
              </span>
            </div>
          )}
        </div>
      </div>

      {currentRaid.mechanics.thresholds && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold tracking-widest text-slate-200 uppercase">
            HP Thresholds
          </h3>
          <ul className="flex list-none flex-col gap-1 p-0">
            {Object.entries(currentRaid.mechanics.thresholds)
              .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
              .map(([hp, info]) => (
                <li
                  key={hp}
                  className="flex items-center rounded-md border border-slate-700 bg-neutral-900 p-2 transition-colors hover:bg-slate-700/50"
                >
                  <span className="mr-3 min-w-[55px] rounded border border-red-500/30 bg-red-500/10 py-0.5 text-center font-mono text-xs font-bold text-red-400">
                    {hp}% HP
                  </span>
                  <span className="text-sm font-medium text-slate-200">
                    {typeof info === "string" ? info : info?.effect}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {currentRaid.moves && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold tracking-widest text-slate-200 uppercase">
            Known Moves
          </h3>
          <ul className="flex list-none flex-wrap gap-1.5 p-0">
            {currentRaid.moves.map((move) => (
              <li
                key={move}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300"
              >
                {move}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
export default RaidMechanicsTab;
