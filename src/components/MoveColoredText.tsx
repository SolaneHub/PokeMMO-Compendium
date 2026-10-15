import {
  ArrowDown,
  Backpack,
  Fish,
  Lock,
  LucideIcon,
  RefreshCw,
  Swords,
} from "lucide-react";

import { usePokedexContext } from "@/context/PokedexContext";
import { renderColoredText } from "@/utils/pokemonMoveColors";

interface MoveColoredTextProps {
  text: string;
}

interface TokenConfig {
  component: LucideIcon;
  color: string;
}

const TOKEN_MAP: Record<string, TokenConfig> = {
  "[SWITCH]": { component: RefreshCw, color: "text-blue-400" },
  "[ATTACK]": { component: Swords, color: "text-red-400" },
  "[ITEM]": { component: Backpack, color: "text-yellow-400" },
  "[STAY]": { component: ArrowDown, color: "text-green-400" },
  "[BAIT]": { component: Fish, color: "text-indigo-400" },
  "[LOCK]": { component: Lock, color: "text-orange-400" },
};

const TOKEN_PATTERN = new RegExp(
  `(${Object.keys(TOKEN_MAP)
    .map((k) => k.replaceAll(/[[\]]/g, String.raw`\$&`))
    .join("|")})`,
  "g"
);

const MoveColoredText = ({ text }: MoveColoredTextProps) => {
  const { pokemonColorMap, isLoading } = usePokedexContext();

  if (!text) return null;
  if (isLoading) {
    return null;
  }

  const parts = text.split(TOKEN_PATTERN);

  return (
    <span>
      {parts.map((part, index) => {
        if (TOKEN_MAP[part]) {
          const { component: Icon, color } = TOKEN_MAP[part];
          return (
            <Icon
              key={`${part}-${index}`}
              size={16}
              className={`mx-1 mb-0.5 inline-block ${color}`}
            />
          );
        } else if (part) {
          return (
            <span key={`${part.substring(0, 10)}-${index}`}>
              {renderColoredText(part, pokemonColorMap)}
            </span>
          );
        }
        return null;
      })}
    </span>
  );
};

export default MoveColoredText;
