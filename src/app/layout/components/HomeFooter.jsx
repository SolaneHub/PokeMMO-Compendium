import { Github, Youtube } from "lucide-react";

function HomeFooter() {
  return (
    <section className="border-t border-white/5 pt-8 pb-8">
      <div className="grid grid-cols-1 gap-8 text-sm text-slate-400 md:grid-cols-2">
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
              rel="noreferrer"
              className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
            >
              <Github size={18} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-slate-200">Credits</h3>
          <ul className="space-y-2 text-slate-500">
            <li className="flex items-center gap-2">
              <Youtube size={14} className="text-red-500" />
              <span>
                Raids by{" "}
                <a
                  href="https://www.youtube.com/@caav.pokemmo"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Caav.PokéMMO
                </a>{" "}
                and{" "}
                <a
                  href="https://discord.gg/gjSNmBmu4j"
                  target="_blank"
                  rel="noreferrer"
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
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Money Guide Community Pickup Guide
                </a>{" "}
                and{" "}
                <a
                  href="https://forums.pokemmo.com/index.php?/topic/146969-optimal-pve-pickup-teddiursa-munchlax-meowth-and-pachirisu-with-leveling-strategies/"
                  target="_blank"
                  rel="noreferrer"
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
