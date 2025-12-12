import {
  BookOpen,
  Calculator,
  Crown,
  Package,
  RefreshCw,
  Skull,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

import HomeFooter from "@/app/layout/components/HomeFooter";
import HomeHero from "@/app/layout/components/HomeHero";
import FeatureCard from "@/shared/components/FeatureCard";
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
      gradient: "from-blue-500/20 to-blue-600/20",
      border: "hover:border-blue-500/50",
      text: "text-blue-400",
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
      gradient: "from-purple-500/20 to-blue-500/20",
      border: "hover:border-purple-500/50",
      text: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-10">
      <PageTitle title="PokéMMO Compendium: Home" />

      {/* Hero Section */}
      <HomeHero />

      {/* Features Grid */}
      <section>
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-200">
          <span className="h-8 w-1 rounded-full bg-blue-500" />
          Tools & Guides
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <FeatureCard key={section.title} {...section} />
          ))}
        </div>
      </section>

      {/* Credits / Footer */}
      <HomeFooter />
    </div>
  );
}

export default Home;
