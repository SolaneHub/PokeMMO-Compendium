import DOMPurify from "dompurify";
import {
  ArrowDown,
  Backpack,
  Fish,
  Lock,
  RefreshCw,
  Swords,
} from "lucide-react";

import { usePokedexData } from "@/shared/hooks/usePokedexData"; // Import usePokedexData
import { colorTextElements } from "@/shared/utils/pokemonMoveColors";

const MoveColoredText = ({ text }) => {
  const { pokemonColorMap, isLoading } = usePokedexData(); // Use the hook

  if (!text) return null;

  // Render nothing or a loading indicator if data is still loading
  if (isLoading) {
    return null; // Or <span className="text-slate-500">Loading...</span>
  }

  // Define our token mapping
  const tokenMap = {
    "[SWITCH]": { component: RefreshCw, color: "text-blue-400" },
    "[ATTACK]": { component: Swords, color: "text-red-400" },
    "[ITEM]": { component: Backpack, color: "text-yellow-400" },
    "[STAY]": { component: ArrowDown, color: "text-green-400" },
    "[BAIT]": { component: Fish, color: "text-indigo-400" },
    "[LOCK]": { component: Lock, color: "text-orange-400" },
  };

  // Create a regex that matches any of our tokens
  // Escape brackets for regex: \[SWITCH\]
  const pattern = new RegExp(
    `(${Object.keys(tokenMap)
      .map((k) => k.replace(/[[\]]/g, "\\$&"))
      .join("|")})`,
    "g"
  );

  // Split the text by the pattern
  // Example: "Use [SWITCH] switch to" -> ["Use ", "[SWITCH]", " switch to"]
  const parts = text.split(pattern);

  return (
    <span>
      {parts.map((part, index) => {
        if (tokenMap[part]) {
          const { component: Icon, color } = tokenMap[part];
          return (
            <Icon
              key={index}
              size={16}
              className={`mx-1 mb-0.5 inline-block ${color}`}
            />
          );
        } else if (part) {
          // This part is regular text (or contains colored moves)
          // We process it with colorTextElements, passing pokemonColorMap
          const htmlContent = colorTextElements(part, pokemonColorMap);
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(htmlContent),
              }}
            />
          );
        }
        return null;
      })}
    </span>
  );
};

export default MoveColoredText;
