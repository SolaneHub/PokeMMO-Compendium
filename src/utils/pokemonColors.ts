export type PokemonType =
  | "Normal"
  | "Fighting"
  | "Flying"
  | "Poison"
  | "Ground"
  | "Rock"
  | "Bug"
  | "Ghost"
  | "Steel"
  | "Fire"
  | "Water"
  | "Grass"
  | "Electric"
  | "Psychic"
  | "Ice"
  | "Dragon"
  | "Dark"
  | "Fairy"
  | "Various"
  | "";

export const typeBackgrounds: Record<PokemonType, string> = {
  Normal: "linear-gradient(to right, #D8D8D8, #9FA19F)",
  Fighting: "linear-gradient(to right, #FFB162, #FF8000)",
  Flying: "linear-gradient(to right, #BDDFFF, #81B9EF)",
  Poison: "linear-gradient(to right, #C078F4, #9141CB)",
  Ground: "linear-gradient(to right, #C2895F, #915121)",
  Rock: "linear-gradient(to right, #DBD8C8, #AFA981)",
  Bug: "linear-gradient(to right, #C5D260, #91A119)",
  Ghost: "linear-gradient(to right, #9C809C, #704170)",
  Steel: "linear-gradient(to right, #A2D0E0, #60A1B8)",
  Fire: "linear-gradient(to right, #FF7172, #E62829)",
  Water: "linear-gradient(to right, #83B9FF, #2980EF)",
  Grass: "linear-gradient(to right, #81D36E, #3FA129)",
  Electric: "linear-gradient(to right, #FFE695, #FAC000)",
  Psychic: "linear-gradient(to right, #FF96B8, #EF4179)",
  Ice: "linear-gradient(to right, #BCF2FF, #3FD8FF)",
  Dragon: "linear-gradient(to right, #909CFF, #5060E1)",
  Dark: "linear-gradient(to right, #747474, #50413F)",
  Fairy: "linear-gradient(to right, #FFCDFF, #EF70EF)",
  Various:
    "linear-gradient(to right, #FF0000, #FF7F00, #F9CB00, #00CE00, #0000FF, #4B0082, #9400D3)",
  "": "linear-gradient(to right, #475569, #1e293b)",
};

const extractGradientColors = (gradientString: string): string[] => {
  const regex = /linear-gradient\(to right, (.+)\)/;
  const match = gradientString.match(regex);
  if (match && match.length === 2) {
    return match[1].split(",").map((color) => color.trim());
  }
  if (gradientString && !gradientString.startsWith("linear-gradient")) {
    return [gradientString.trim()];
  }
  return [];
};

export const getPrimaryColor = (
  backgroundStyle: string | null | undefined
): string => {
  if (!backgroundStyle) {
    return "#475569";
  }
  if (backgroundStyle.startsWith("linear-gradient")) {
    const colors = extractGradientColors(backgroundStyle);
    return colors.length > 0 ? colors[0] : "#475569";
  } else {
    return backgroundStyle;
  }
};

export const getDualShadow = (
  backgroundStyle: string | null | undefined
): string => {
  if (!backgroundStyle) {
    return `0 4px 10px #475569aa`;
  }
  if (backgroundStyle.startsWith("linear-gradient")) {
    const colors = extractGradientColors(backgroundStyle);
    if (colors.length >= 7) {
      return ` 0 -7px 12px ${colors[0]}88, /* Red - Top */ 5px -5px 12px ${colors[1]}88, /* Orange */ 7px 0 12px ${colors[2]}88, /* Yellow */ 6px 6px 12px ${colors[3]}aa, /* Green (Opacity Boost) */ 0 7px 12px ${colors[4]}88, /* Blue - Bottom */ -6px 6px 12px ${colors[5]}88, /* Indigo */ -7px 0 12px ${colors[6]}88, /* Violet */ -5px -5px 12px ${colors[0]}88 /* Red Loop Closure */ `;
    }
    if (colors.length >= 2) {
      return `0 4px 10px ${colors[0]}aa, 0 2px 5px ${colors[1]}aa`;
    }
    if (colors.length === 1) {
      return `0 4px 10px ${colors[0]}aa`;
    }
  } else {
    return `0 4px 10px ${backgroundStyle}aa`;
  }
  return `0 4px 10px #475569aa`;
};

export const generateDualTypeGradient = (
  type1: PokemonType | string,
  type2: PokemonType | string
): string => {
  const t1 = type1 as PokemonType;
  const t2 = type2 as PokemonType;

  const gradient1 = typeBackgrounds[t1];
  const gradient2 = typeBackgrounds[t2];

  if (!gradient1 && !gradient2) {
    return typeBackgrounds[""];
  }

  if (!gradient1) {
    return typeBackgrounds[t2] || typeBackgrounds[""];
  }

  if (!gradient2) {
    return typeBackgrounds[t1] || typeBackgrounds[""];
  }

  const colors1 = extractGradientColors(gradient1);
  const colors2 = extractGradientColors(gradient2);

  if (colors1.length === 0 || colors2.length === 0) {
    return typeBackgrounds[t1] || typeBackgrounds[t2] || typeBackgrounds[""];
  }

  if (t1 === "Various") {
    return typeBackgrounds["Various"];
  }
  if (t2 === "Various") {
    return typeBackgrounds["Various"];
  }

  if (colors1.length >= 2 && colors2.length >= 2) {
    return `linear-gradient(to right, ${colors1[1]}, ${colors2[1]})`;
  } else if (colors1.length >= 1 && colors2.length >= 1) {
    return `linear-gradient(to right, ${colors1[0]}, ${colors2[0]})`;
  }

  return typeBackgrounds[t1] || typeBackgrounds[t2] || typeBackgrounds[""];
};
