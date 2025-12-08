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
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e2025] to-[#15161a] border border-white/5 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent mb-4">
            Welcome, Trainer.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
            The ultimate companion for your PokéMMO journey. Master the Elite
            Four, breed competitive Pokémon, and conquer late-game content with
            data-driven strategies.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-blue-500 rounded-full" />
          Tools & Guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.title}
                to={section.path}
                className={`group relative p-6 rounded-2xl bg-[#1a1b20] border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${section.border}`}
              >
                {/* Hover Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-white/5 backdrop-blur-sm ${section.text}`}
                    >
                      <Icon size={24} />
                    </div>
                    <ExternalLink
                      size={16}
                      className="text-slate-600 group-hover:text-slate-400 transition-colors"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-400">
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">About</h3>
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
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Credits</h3>
            <ul className="space-y-2 text-slate-500">
              <li className="flex items-center gap-2">
                <Youtube size={14} className="text-red-500" />
                <span>Raids by Caav.PokéMMO</span>
              </li>
              <li>
                <span>Strategy: Team Porygon & PokeKing</span>
              </li>
              <li>
                <span>Data: PokéMMO Hub & ShoutWiki</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
