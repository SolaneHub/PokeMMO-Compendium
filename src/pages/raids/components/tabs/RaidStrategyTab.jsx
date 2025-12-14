const RaidStrategyTab = ({
  currentRaid,
  selectedStrategyIndex,
  setSelectedStrategyIndex,
  setSelectedRole,
  setSelectedTurnIndex,
  setSelectedBuildGroup,
  rolesSource,
  roleOptions,
  effectiveSelectedRole,
  handleRoleChange,
  movesForSelectedRole,
  selectedTurnIndex,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {currentRaid.teamStrategies && currentRaid.teamStrategies.length > 1 && (
        <section className="rounded-lg bg-neutral-800 p-3">
          <h3 className="mb-2 text-xs font-bold tracking-widest text-slate-200 uppercase">
            Select Strategy
          </h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2">
            {currentRaid.teamStrategies.map((strategy, idx) => (
              <button
                key={strategy.id || idx}
                className={`cursor-pointer rounded-md border border-slate-700 bg-neutral-900 p-2 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-700 hover:text-slate-200 ${selectedStrategyIndex === idx ? "border-blue-500 bg-blue-500/15 text-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" : ""} `}
                onClick={() => {
                  setSelectedStrategyIndex(idx);
                  setSelectedRole(null);
                  setSelectedTurnIndex(0);
                  setSelectedBuildGroup(null);
                }}
              >
                {strategy.label || `Version ${idx + 1}`}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg bg-neutral-800 p-3">
        {rolesSource && roleOptions.length > 0 ? (
          <div className="flex flex-col">
            <h3 className="mb-3 text-xs font-bold tracking-widest text-slate-200 uppercase">
              Player Roles
            </h3>

            <div className="mb-3 flex flex-wrap gap-2">
              {roleOptions.map((roleKey) => (
                <button
                  key={roleKey}
                  className={`min-w-[80px] flex-1 cursor-pointer rounded-md border border-slate-700 bg-neutral-900 px-1.5 py-2.5 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-700 hover:text-slate-200 ${effectiveSelectedRole === roleKey ? "border-blue-500 bg-blue-500/15 text-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" : ""} `}
                  onClick={() => handleRoleChange(roleKey)}
                >
                  {roleKey === "player1"
                    ? "Player 1"
                    : roleKey.replace("player", "Player ")}
                </button>
              ))}
            </div>

            {movesForSelectedRole.length > 0 && (
              <>
                <div className="flex items-center justify-between rounded-t-lg border border-slate-700 border-b-neutral-900 bg-slate-700 p-2">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-600 bg-neutral-800 text-white transition-all hover:border-blue-500 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-600 disabled:hover:bg-neutral-800"
                    disabled={selectedTurnIndex === 0}
                    onClick={() =>
                      setSelectedTurnIndex((prev) => Math.max(0, prev - 1))
                    }
                  >
                    ❮
                  </button>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Turn
                    </span>
                    <span className="font-mono text-lg font-bold text-white">
                      {selectedTurnIndex + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      / {movesForSelectedRole.length}
                    </span>
                  </div>

                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-600 bg-neutral-800 text-white transition-all hover:border-blue-500 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-600 disabled:hover:bg-neutral-800"
                    disabled={
                      selectedTurnIndex >= movesForSelectedRole.length - 1
                    }
                    onClick={() =>
                      setSelectedTurnIndex((prev) =>
                        Math.min(movesForSelectedRole.length - 1, prev + 1)
                      )
                    }
                  >
                    ❯
                  </button>
                </div>

                <ul className="mt-0 flex list-none flex-col gap-1 rounded-b-lg border border-t-0 border-slate-700 bg-neutral-900 p-2.5">
                  {movesForSelectedRole.map((item, idx) => (
                    <li
                      key={idx}
                      className={`relative flex cursor-pointer items-center rounded-md px-3 py-2 text-sm transition-colors ${
                        idx === selectedTurnIndex
                          ? "border border-blue-500/30 bg-blue-500/15"
                          : "hover:bg-slate-800"
                      } `}
                      onClick={() => setSelectedTurnIndex(idx)}
                    >
                      <span
                        className={`mr-3 min-w-[25px] font-mono text-xs ${idx === selectedTurnIndex ? "font-bold text-blue-400" : "text-slate-500"}`}
                      >
                        T{idx + 1}:
                      </span>
                      <span className="flex-1 text-slate-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          <p className="p-4 text-center text-slate-500 italic">
            No strategy data available.
          </p>
        )}
      </section>
    </div>
  );
};
export default RaidStrategyTab;
