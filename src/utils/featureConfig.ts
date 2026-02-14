import {
  BookOpen,
  Calculator,
  Crown,
  Lock,
  LucideIcon,
  Package,
  RefreshCw,
  Shield,
  Skull,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  color: string;
  lockedIcon?: LucideIcon;
  lockedColor?: string;
}

export const FEATURE_CONFIG: Record<string, Feature> = {
  pokedex: {
    title: "Pokédex",
    description:
      "Search Pokémon data, base stats, locations, and evolution details.",
    icon: BookOpen,
    link: "/pokedex",
    color: "#ef4444", // Pokedex Red
  },
  breeding: {
    title: "Breeding",
    description:
      "Cost-effective breeding paths and tools to help you get perfect Pokémon.",
    icon: Calculator,
    link: "/breeding",
    color: "#f472b6", // Egg Pink
  },
  "catch-calculator": {
    title: "Catch Calculator",
    description:
      "Calculate exact catch probabilities based on HP, status, and ball types.",
    icon: Trophy,
    link: "/catch-calculator",
    color: "#3b82f6", // Great Ball Blue
  },
  pickup: {
    title: "Pickup",
    description:
      "Complete guide for Pickup items, locations, and level requirements.",
    icon: Package,
    link: "/pickup",
    color: "#b45309", // Ground/Item Brown
  },
  "elite-four": {
    title: "Elite Four",
    description:
      "Complete guides and strategies for all regional Elite Four challenges.",
    icon: Crown,
    link: "/elite-four",
    color: "#f59e0b", // Champion Gold
  },
  "trainer-rerun": {
    title: "Trainer Rerun",
    description:
      "Optimize your money-making with the most efficient gym rerun routes.",
    icon: RefreshCw,
    link: "/trainer-rerun",
    color: "#10b981", // Money Green
  },
  raids: {
    title: "Raids",
    description:
      "Specialized team builds and mechanics for Co-op Raid Boss encounters.",
    icon: Users,
    link: "/raids",
    color: "#6366f1", // Raid Indigo
  },
  "super-trainers": {
    title: "Super Trainers",
    description:
      "Detailed strategies for high-level trainer rematches and daily runs.",
    icon: Swords,
    link: "/super-trainers",
    color: "#8b5cf6", // Veteran Purple
  },
  "boss-fights": {
    title: "Boss Fights",
    description:
      "Strategies for World Bosses, Red, and special story encounters.",
    icon: Skull,
    link: "/boss-fights",
    color: "#991b1b", // Boss Danger Red
  },
  "my-teams": {
    title: "My Teams",
    description:
      "Build, save and manage your own competitive teams for every encounter.",
    icon: Shield,
    link: "/my-teams",
    color: "#06b6d4", // Personal Cyan
    lockedIcon: Lock,
    lockedColor: "#475569",
  },
};
