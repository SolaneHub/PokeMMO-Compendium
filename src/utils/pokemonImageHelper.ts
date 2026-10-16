import { standardPokemonList } from "@/constants/standardPokemonList";

const variantIds: Record<string, number> = {
  "Castform (Sunny)": 10013,
  "Castform (Rainy)": 10014,
  "Castform (Snowy)": 10015,
  "Deoxys (Attack)": 10001,
  "Deoxys (Defense)": 10002,
  "Deoxys (Speed)": 10003,
  "Wormadam (Plant)": 413,
  "Wormadam (Sandy)": 10004,
  "Wormadam (Trash)": 10005,
  "Heat Rotom": 10008,
  "Wash Rotom": 10009,
  "Frost Rotom": 10010,
  "Fan Rotom": 10011,
  "Mow Rotom": 10012,
  "Giratina (Origin)": 10007,
  "Shaymin (Sky)": 10006,
  "Basculin (Blue-Striped)": 10016,
  "Darmanitan (Zen)": 10017,
  "Tornadus (Therian)": 10019,
  "Thundurus (Therian)": 10020,
  "Landorus (Therian)": 10021,
  "Kyurem (Black)": 10022,
  "Kyurem (White)": 10023,
  "Keldeo (Resolute)": 10024,
  "Meloetta (Pirouette)": 10018,
};

const STANDARD_POKEMON_MAP = new Map<string, number>(
  standardPokemonList.map((name, index) => [name, index + 1])
);

export const getSpriteUrlByName = (name: string): string | null => {
  const baseUrl =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world";
  if (variantIds[name]) {
    return `${baseUrl}/${variantIds[name]}.svg`;
  }
  let cleanName = name.split(" (")[0] || "";
  if (name === "Nidoran♀") cleanName = "Nidoran♀";
  if (name === "Nidoran♂") cleanName = "Nidoran♂";
  if (name === "Basculin (Red-Striped)") cleanName = "Basculin";

  if (cleanName) {
    const dexNum = STANDARD_POKEMON_MAP.get(cleanName);
    if (dexNum !== undefined) {
      return `${baseUrl}/${dexNum}.svg`;
    }
  }
  return null;
};

export const formatItemNameForUrl = (itemName: string): string => {
  if (!itemName) return "";

  // Remove anything in parentheses (like probabilities) explicitly to avoid ReDoS Security Hotspot
  let formatted = "";
  let depth = 0;
  for (const char of itemName) {
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      if (depth > 0) depth--;
    } else if (depth === 0) {
      formatted += char;
    }
  }
  formatted = formatted.trim();

  const overrides: Record<string, string> = {
    "Poké Ball": "Poké_Ball",
    "Poke Ball": "Poké_Ball",
    TinyMushroom: "Tiny_Mushroom",
    NeverMeltIce: "Never-Melt_Ice",
    TwistedSpoon: "Twisted_Spoon",
    BrightPowder: "Bright_Powder",
    DeepSeaScale: "Deep_Sea_Scale",
    DeepSeaTooth: "Deep_Sea_Tooth",
    Thunderstone: "Thunder_Stone",
    "Choice Scarf": "Choice_Scarf",
    "Choice Specs": "Choice_Specs",
    "Choice Band": "Choice_Band",
  };

  // Case-insensitive override check
  const lowerFormatted = formatted.toLowerCase();
  const overrideKey = Object.keys(overrides).find(
    (k) => k.toLowerCase() === lowerFormatted
  );

  if (overrideKey) {
    return overrides[overrideKey] || "";
  }

  // Standard formatting: Title Case words and join with underscores
  return formatted
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("_")
    .replaceAll(".", "")
    .replaceAll(/([a-z])([A-Z])/g, "$1_$2");
};
