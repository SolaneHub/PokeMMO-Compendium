import {
  ArrowDown,
  Backpack,
  Fish,
  Lock,
  LucideIcon,
  RefreshCw,
  Swords,
} from "lucide-react";

import { usePokedexData } from "@/hooks/usePokedexData";
import { renderColoredText } from "@/utils/pokemonMoveColors";

interface MoveColoredTextProps {
  text: string;
}

interface TokenConfig {
  component: LucideIcon;
  color: string;
}

const MoveColoredText = ({ text }: MoveColoredTextProps) => {
  const { pokemonColorMap, isLoading } = usePokedexData();

  if (!text) return null;
  if (isLoading) {
    return null;
  }

  const tokenMap: Record<string, TokenConfig> = {
    "[SWITCH]": { component: RefreshCw, color: "text-blue-400" },
    "[ATTACK]": { component: Swords, color: "text-red-400" },
    "[ITEM]": { component: Backpack, color: "text-yellow-400" },
    "[STAY]": { component: ArrowDown, color: "text-green-400" },
    "[BAIT]": { component: Fish, color: "text-indigo-400" },
    "[LOCK]": { component: Lock, color: "text-orange-400" },
  };

  const pattern = new RegExp(
    `(${Object.keys(tokenMap)
      .map((k) => k.replaceAll(/[[\]]/g, String.raw`\$&`))
      .join("|")})`,
    "g"
  );

  const parts = text.split(pattern);

  return (
    <span>
      {parts.map((part, index) => {
        if (tokenMap[part]) {
          const { component: Icon, color } = tokenMap[part];
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
