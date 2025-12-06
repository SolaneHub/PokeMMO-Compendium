import { Link } from "react-router-dom";

import PageTitle from "@/shared/components/PageTitle";

function Home() {
  const sections = [
    {
      title: "Elite Four",
      path: "/elite-four",
      desc: "Detailed strategies and teams for defeating the Elite Four in every region.",
      color: "bg-indigo-600",
      hover: "hover:bg-indigo-700",
    },
    {
      title: "Red Guide",
      path: "/red",
      desc: "Prepare for the ultimate challenge at Mt. Silver. Teams and tactics included.",
      color: "bg-red-600",
      hover: "hover:bg-red-700",
    },
    {
      title: "Ho-Oh",
      path: "/ho-oh",
      desc: "Steps and requirements to encounter and battle the legendary Ho-Oh.",
      color: "bg-orange-500",
      hover: "hover:bg-orange-600",
    },
    {
      title: "Raids",
      path: "/raids",
      desc: "Find raid dens, check rewards, and plan your farming routes.",
      color: "bg-blue-600",
      hover: "hover:bg-blue-700",
    },
    {
      title: "Pokédex",
      path: "/pokedex",
      desc: "Search for Pokémon stats, moves, and evolution data.",
      color: "bg-emerald-600",
      hover: "hover:bg-emerald-700",
    },
    {
      title: "Pickup",
      path: "/pickup",
      desc: "Item drop tables for the Pickup ability across all levels.",
      color: "bg-teal-600",
      hover: "hover:bg-teal-700",
    },
    {
      title: "Breeding",
      path: "/breeding",
      desc: "Calculators and tools to help you breed perfect Pokémon.",
      color: "bg-pink-600",
      hover: "hover:bg-pink-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <PageTitle title="PokéMMO Compendium: Home" />

      {/* Hero Section */}
      <div className="bg-slate-800 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-yellow-400">
            PokéMMO Compendium
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300">
            Your ultimate guide to breeding, battles, and late-game content.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {sections.map((section) => (
            <Link
              key={section.title}
              to={section.path}
              className={`block overflow-hidden rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${section.color} ${section.hover}`}
            >
              <div className="p-6 text-white h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                  <p className="text-white/90">{section.desc}</p>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-white/80">
                  <span>Explore &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Credits / Info Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 border-slate-200 dark:border-slate-700">
            About this Project
          </h2>
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            <p className="mb-4">
              This compendium serves as a community-driven guide for{" "}
              <strong>PokéMMO</strong> players — gathering essential data and
              strategies to assist in breeding, team building, and late-game
              encounters such as the Elite Four and Red.
            </p>
            <p className="mb-6">
              It stands as a collaborative effort shaped by countless trainers,
              creators, and guide writers across the PokéMMO community.
            </p>

            <h3 className="text-lg font-semibold mb-3">Credits & Resources</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Breeding & Pokédex:</strong> Inspired by{" "}
                <a
                  href="https://pokemmohub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  PokéMMO Hub
                </a>
                .
              </li>
              <li>
                <strong>Elite Four, Red & Ho-Oh:</strong> Strategies adapted
                from{" "}
                <a
                  href="https://team-porygon-pokemmo.pages.dev/guides/EliteFour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Team Porygon PokéMMO Guide
                </a>{" "}
                and{" "}
                <a
                  href="http://pokeking.icu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  PokeKing
                </a>
                .
              </li>
              <li>
                <strong>Raids:</strong> Based on content from{" "}
                <a
                  href="https://www.youtube.com/@caav.pokemmo/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Caav.PokéMMO YouTube Channel
                </a>
                .
              </li>
              <li>
                <strong>Pickup:</strong> Mechanics sourced from{" "}
                <a
                  href="https://pokemmo.shoutwiki.com/wiki/Pickup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  PokéMMO ShoutWiki
                </a>
                .
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
