function HomeFooter() {
  return (
    <section className="border-t border-white/5 pt-8 pb-8 text-white">
      <div className="grid grid-cols-1 gap-8 text-sm md:grid-cols-2">
        <div>
          <h3 className="mb-3 font-semibold text-slate-200">About</h3>
          <p className="leading-relaxed text-slate-500">
            This compendium is a community-driven open source project. It is not
            affiliated with PokeMMO or Nintendo. Data is gathered from various
            community resources.
          </p>
          <div className="mt-4 flex gap-4">
            <a
              href="https://github.com/SolaneHub/PokeMMO-Compendium"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-blue-400"
            >
              <svg
                className="h-[18px] w-[18px] fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>{" "}
              <span>GitHub</span>
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-slate-200">Credits</h3>
          <ul className="space-y-2 text-slate-500">
            <li className="flex items-center gap-2">
              <svg
                className="h-[14px] w-[14px] fill-current text-red-500"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>
                Raids by{" "}
                <a
                  href="https://www.youtube.com/@caav.pokemmo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Caav.PokéMMO
                </a>{" "}
                and{" "}
                <a
                  href="https://discord.gg/gjSNmBmu4j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  PokeMMO Raid Den Discord
                </a>
              </span>
            </li>
            <li>
              <span>Elite Four Strategies: Pokeking & Team Porygon</span>
            </li>
            <li>
              <span>
                Pickup guides:{" "}
                <a
                  href="https://forums.pokemmo.com/index.php?/topic/106742-money-guide-community-pickup-guide-2nd-edition/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Money Guide Community Pickup Guide
                </a>{" "}
                and{" "}
                <a
                  href="https://forums.pokemmo.com/index.php?/topic/146969-optimal-pve-pickup-teddiursa-munchlax-meowth-and-pachirisu-with-leveling-strategies/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Optimal PvE Pickup Guide
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default HomeFooter;
