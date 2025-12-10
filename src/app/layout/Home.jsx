import {
  BookOpen,
  Calculator,
  Crown,
  ExternalLink,
  Github,
  Package,
  RefreshCw,
  Skull,
  Swords,
  Trophy,
  Users,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

import PageTitle from "@/shared/components/PageTitle";

function Home() {
  const sections = [
    {
      title: "Pokédex",
      path: "/pokedex",
      desc: "Search for Pokémon stats, moves, and evolution data.",
      icon: BookOpen,
      gradient: "from-emerald-500/20 to-green-500/20",
      border: "hover:border-emerald-500/50",
      text: "text-emerald-400",
    },
    {
      title: "Breeding",
      path: "/breeding",
      desc: "Calculators and tools to help you breed perfect Pokémon.",
      icon: Calculator,
      gradient: "from-pink-500/20 to-rose-500/20",
      border: "hover:border-pink-500/50",
      text: "text-pink-400",
    },
    {
      title: "Catch Calculator",
      path: "/catch-calculator",
      desc: "Calculate the probability of catching any Pokémon with various conditions and Poké Balls.",
      icon: Trophy,
      gradient: "from-green-500/20 to-lime-500/20",
      border: "hover:border-green-500/50",
      text: "text-green-400",
    },
    {
      title: "Pickup",
      path: "/pickup",
      desc: "Item drop tables for the Pickup ability across all levels.",
      icon: Package,
      gradient: "from-teal-500/20 to-emerald-500/20",
      border: "hover:border-teal-500/50",
      text: "text-teal-400",
    },
    {
      title: "Elite Four",
      path: "/elite-four",
      desc: "Detailed strategies and teams for defeating the Elite Four in every region.",
      icon: Crown,
      gradient: "from-indigo-500/20 to-blue-500/20",
      border: "hover:border-indigo-500/50",
      text: "text-indigo-400",
    },
    {
      title: "Trainer Rerun",
      path: "/trainer-rerun",
      desc: "Optimize your daily grind with efficient trainer rematch routes and team compositions.",
      icon: RefreshCw,
      gradient: "from-orange-500/20 to-red-500/20",
      border: "hover:border-orange-500/50",
      text: "text-orange-400",
    },
    {
      title: "Raids",
      path: "/raids",
      desc: "Find raid dens, check rewards, and plan your farming routes.",
      icon: Users,
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "hover:border-blue-500/50",
      text: "text-blue-400",
    },
    {
      title: "Super Trainers",
      path: "/super-trainers",
      desc: "Strategies for challenging Super Trainers like Red, Cynthia, and Morimoto.",
      icon: Swords,
      gradient: "from-yellow-500/20 to-amber-500/20",
      border: "hover:border-yellow-500/50",
      text: "text-yellow-400",
    },
    {
      title: "Boss Fights",
      path: "/boss-fights",
      desc: "Guides and tactics for legendary boss encounters (e.g., Ho-Oh) and other unique fights.",
      icon: Skull,
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "hover:border-purple-500/50",
      text: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-10">
      <PageTitle title="PokéMMO Compendium: Home" />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#1e2025] to-[#15161a] p-8 shadow-2xl md:p-12">
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative z-10">
          <h1 className="mb-4 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Welcome, Trainer.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            The ultimate companion for your PokéMMO journey. Master the Elite
            Four, breed competitive Pokémon, and conquer late-game content with
            data-driven strategies.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-200">
          <span className="h-8 w-1 rounded-full bg-blue-500" />
          Tools & Guides
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.title}
                to={section.path}
                className={`group relative rounded-2xl border border-white/5 bg-[#1a1b20] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${section.border}`}
              >
                {/* Hover Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${section.gradient} rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`rounded-xl bg-white/5 p-3 backdrop-blur-sm ${section.text}`}
                    >
                      <Icon size={24} />
                    </div>
                    <ExternalLink
                      size={16}
                      className="text-slate-600 transition-colors group-hover:text-slate-400"
                    />
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-slate-100">
                    {section.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-slate-400">
                    {section.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Credits / Footer */}
      <section className="border-t border-white/5 pt-8 pb-8">
        <div className="grid grid-cols-1 gap-8 text-sm text-slate-400 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-semibold text-slate-200">About</h3>
            <p className="leading-relaxed text-slate-500">
              This compendium is a community-driven open source project. It is
              not affiliated with PokeMMO or Nintendo. Data is gathered from
              various community resources.
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
    </div>
  );
}

export default Home;
