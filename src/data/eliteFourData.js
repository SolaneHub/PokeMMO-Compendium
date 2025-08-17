// Importa le immagini dei membri degli Superquattro di Kanto dalla cartella assets
import loreleiImage from "../assets/elite4/LoreleiLGPE.png";
import brunoImage from "../assets/elite4/BrunoLGPE.png";
import agathaImage from "../assets/elite4/AgathaLGPE.png";
import lanceImage from "../assets/elite4/LanceLGPE.png";
import blueImage from "../assets/elite4/BluLGPE.png";

// Importa le immagini dei membri degli Superquattro di Johto dalla cartella assets
import willImage from "../assets/elite4/WillHGSS.png";
import kogaImage from "../assets/elite4/KogaLGPE.png";
import karenImage from "../assets/elite4/KarenHGSS.png";

// Importa le immagini dei membri degli Superquattro di Hoenn dalla cartella assets
import sidneyImage from "../assets/elite4/SidneyROZA.png";
import phoebeImage from "../assets/elite4/PhoebeROZA.png";
import glaciaImage from "../assets/elite4/GlaciaROZA.png";
import drakeImage from "../assets/elite4/DrakeROZA.png";
import wallaceImage from "../assets/elite4/WallaceROZA.png";

// Importa le immagini dei membri degli Superquattro di Sinnoh dalla cartella assets
import aaronImage from "../assets/elite4/AaronDP.png";
import berthaImage from "../assets/elite4/BerthaDP.png";
import flintImage from "../assets/elite4/FlintDP.png";
import lucianImage from "../assets/elite4/LucianDP.png";
import cynthiaImage from "../assets/elite4/CynthiaDP.png";

// Importa le immagini dei membri degli Superquattro di Unima dalla cartella assets
import shauntalImage from "../assets/elite4/ShauntalNB.png";
import grimsleyImage from "../assets/elite4/GrimsleyNB.png";
import caitlinImage from "../assets/elite4/CaitlinNB.png";
import marshalImage from "../assets/elite4/MarshalNB.png";
import alderImage from "../assets/elite4/AlderNB.png";

// Array di oggetti che rappresentano i membri degli Superquattro
export const eliteFourMembers = [
  {
    name: "Lorelei",
    region: "Kanto",
    type: "Ghiaccio",
    image: loreleiImage,
    pokemonCardCount: 19,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Articuno",
          "Bronzong",
          "Chansey",
          "Claydol",
          "Dragonite",
          "Exeggutor",
          "Golduck",
          "Hariyama",
          "Jynx",
          "Lapras",
          "Lucario",
          "Magnezone",
          "Mantine",
          "Nidoking",
          "Nidoqueen",
          "Raichu",
          "Slowbro",
          "Togekiss",
          "Vileplume",
        ].sort(),
        pokemonStrategies: {
          Articuno: [
            {
              type: "main", // Modificato il tipo per la strategia principale
              player:
                "🪨 Use Stealth Rock 🔄 switch to 🕯️ Chandelure 🧠 use 3x Calm Mind 🧪 give X Speed",
              variations: [
                {
                  type: "step",
                  name: "🔄 Articuno switches to Claydol ", // Aggiunto il nome della variazione
                  steps: [
                    // Le variazioni ora contengono un array di step
                    {
                      type: "step",
                      player:
                        "🔄 switch to 🥚 Blissey 🔁 use Trick 🔄 switch to 🕯️ Chandelure 🧠 use 3x Calm Mind 🧪 give X Speed",
                    },
                  ],
                },
              ],
            },
          ],
          Bronzong: [
            {
              type: "main", // Modificato il tipo per la strategia principale
              player: "🔁 Trick",
              variations: [
                {
                  type: "step",
                  name: "💥 Earthquake", // Nome della variazione
                  steps: [
                    {
                      type: "step",
                      player:
                        "🔄 switch to ⛏️ Excadrill 🪨 use Stealth Rock 💪 use 3x Swords Dance 🧪 give X Speed",
                    },
                  ],
                },
                {
                  name: "💥 Gyro Ball", // Nome della variazione
                  steps: [
                    {
                      type: "main",
                      player: "🔄 switch to 🥊 Poliwrath",
                      variations: [
                        {
                          type: "step",
                          name: "🔄 Bronzong switches to Lapras",
                          steps: [
                            {
                              type: "step",
                              player:
                                "💪 use Belly Drum 🛡️ tank Golduck ☠️ Toxic 💥 Ice Punch Vileplume",
                            },
                          ],
                        },
                        {
                          name: "🔄 Bronzong switches to Vileplume",
                          steps: [
                            {
                              type: "main",
                              player: "🔄 switch to 🥚 Blissey 🔁 use Trick",
                              variations: [
                                {
                                  type: "step",
                                  name: "✔️ Vileplume stays",
                                  steps: [
                                    {
                                      type: "main",
                                      player: [
                                        "🔄 switch to ⛏️ Excadrill 💪 use 2x Sword Dance",
                                      ],
                                      variations: [
                                        {
                                          type: "step",
                                          name: "🔄 Vileplume switches to Dewgong",
                                          steps: [
                                            {
                                              type: "step",
                                              player:
                                                "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum (❓ if Golduck switches in 🛡️ tank ☠️ Toxic) 💥 use Drain Punch 💥 Ice Punch Vileplume",
                                            },
                                          ],
                                        },
                                        {
                                          type: "step",
                                          name: "🔄 Vileplume switches to Lapras",
                                          steps: [
                                            {
                                              type: "step",
                                              player:
                                                "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum (❓ if Golduck switches in 🛡️ tank ☠️ Toxic) 💥 use Drain Punch 💥 Ice Punch Vileplume",
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "🔄 Vileplume switches to Dewgong",
                                  steps: [
                                    {
                                      type: "step",
                                      player:
                                        "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum (❓ if Golduck switches in 🛡️ tank ☠️ Toxic) 💥 use Drain Punch 💥 Ice Punch Vileplume",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "🔄 Chansey", // Nome della variazione
                  steps: [
                    {
                      type: "main",
                      player:
                        "🔄 Switch to 🕯️ Chandelure 🧠 use 5x Calm Mind 🧪 give X Speed",
                      variations: [
                        {
                          type: "step",
                          name: "🔄 Chansey switches to Mantine",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 🤖 Metagross 🔁 use Trick 🔄 switch to ⛏️ Excadrill 🪨 use Stealth Rock 💪 use 3x Swords Dance 🧪 give X Speed",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "🔄 Dragonite", // Nome della variazione
                  steps: [
                    {
                      type: "step",
                      player:
                        "🪨 use Stealth Rock 🔄 switch to 🥚 Blissey 🔁 use Trick 🔄 switch to 🕯️ Chandelure 🧠 use 3x Calm Mind 🧪 give X Speed",
                    },
                  ],
                },
                {
                  name: "🔄 Golduck", // Nome della variazione
                  steps: [
                    {
                      type: "step",
                      player:
                        "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                    },
                  ],
                },
                {
                  name: "🔄 Hariyama", // Nome della variazione
                  steps: [
                    {
                      type: "step",
                      player:
                        "🔄 switch to 🕯️ Chandelure 🧠 use 4x Calm Mind 🧪 give X Speed",
                    },
                  ],
                },
                {
                  name: "🔄 Lapras", // Nome della variazione
                  steps: [
                    {
                      variations: [
                        {
                          type: "step",
                          name: "you get 🥋 Expert Belt",
                          steps: [
                            {
                              type: "main",
                              player:
                                "🔄 switch to ⛏️ Excadrill 💪 use 2x Swords Dance",
                              variations: [
                                {
                                  type: "step",
                                  name: "Lapras uses 💥 Waterfall",
                                  steps: [
                                    {
                                      type: "step",
                                      player:
                                        "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: "step",
                          name: "you get ⛑️ Rocky Helmet",
                          steps: [
                            {
                              type: "main",
                              player:
                                "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                              variations: [
                                {
                                  type: "step",
                                  name: "🔄 Lapras switches to Hariyama",
                                  steps: [
                                    {
                                      type: "step",
                                      player:
                                        "🔄 switch to 🕯️ Chandelure 🔄 switch to the 2nd 🤖 Metagross 🔁 use Trick 🔄 switch to 🕯️ Chandelure 🧠 use 4x Calm Mind 🧪 give X Speed",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "🔄 Nidoking", // Nome della variazione
                  steps: [
                    {
                      type: "main",
                      player:
                        "🔄 switch to ⛏️ Excadrill 💪 use 2x Swords Dance 🧪 give X Speed",
                      variations: [
                        {
                          type: "step",
                          name: "🔄 Nidoking switches to Lapras",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "🔄 Slowbro", // Nome della variazione
                  steps: [
                    {
                      type: "main",
                      player: "🪨 use Stealth Rock 🔄 switch to 🕯️ Chandelure",
                      variations: [
                        {
                          type: "step",
                          name: "✔️ Slowbro stays",
                          steps: [
                            {
                              type: "step",
                              player: "🧠 use 3x Calm Mind 🧪 give X Speed",
                            },
                          ],
                        },
                        {
                          type: "step",
                          name: "🔄 Slowbro switches to Dragonite",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 🤖 Metagross 🔁 use Trick 🔄 switch to 🕯️ Chandelure 🧠 use 3x Calm Mind 🧪 give X Speed",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "🔄 Vileplume", // Nome della variazione
                  steps: [
                    {
                      type: "step",
                      player:
                        "🔄 switch to 🕯️ Chandelure 🧠 6x Calm Mind 🧪 give X Speed",
                    },
                  ],
                },
              ],
            },
          ],
          Chansey: [
            {
              type: "step",
              player:
                "🔁 Trick 🪨 use Stealth Rock 🔄 switch to 🕯️ Chandelure 🧠 4x Calm Mind 🧪 give X Speed",
            },
          ],
          Claydol: [
            {
              type: "step",
              player:
                "🪨 Use Stealth Rock 🔄 switch to 🕯️ Chandelure 🧠 3x Calm Mind 🧪 give X Speed",
            },
          ],
          Dragonite: [
            {
              type: "main",
              player: "🔁 Trick",
              variations: [
                {
                  type: "step",
                  name: "you get 🥋 Expert Belt",
                  steps: [
                    {
                      variations: [
                        {
                          type: "step",
                          name: "💥 Flamethrower",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                            },
                          ],
                        },
                        {
                          type: "step",
                          name: "💥 Fire Punch",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🪨 use Stealth Rock 🔄 switch to 🥚 Blissey use 🔁 Trick 🔄 Switch to 🕯️ Chandelure 🧠 3x Calm Mind 🧪 give X Speed",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "step",
                  name: "you get 🍽️ Leftovers",
                  steps: [
                    {
                      type: "step",
                      player:
                        "🪨 use Stealth Rock 🔄 switch to 🥚 Blissey use 🔁 Trick 🔄 Switch to 🕯️ Chandelure 🧠 3x Calm Mind 🧪 give X Speed",
                    },
                  ],
                },
              ],
            },
          ],
          Exeggutor: [
            {
              type: "step",
              player:
                "🔁 Trick 🪨 use Stealth Rock 🔄 switch to 🕯️ Chandelure 🧠 3x Calm Mind 🧪 give X Speed",
            },
          ],
          Golduck: [
            {
              type: "main",
              player: "🔁 Trick",
              variations: [
                {
                  type: "step",
                  name: "✔️ Golduck stays",
                  steps: [
                    {
                      type: "main",
                      player: "🔁 switch to 🥚 Blissey 🪨 use Stealth Rock",
                      variations: [
                        {
                          type: "step",
                          name: "🔄 Golduck switches to Exeggutor",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 🕯️ Chandelure 🔄 switch to 2nd 🤖 Metagross 🔁 use Trick 🔄 go back to 🕯️ Chandelure 🧠 3x Calm Mind 🧪 give X Speed",
                            },
                          ],
                        },
                        {
                          type: "step",
                          name: "🔄 Golduck switches to Lapras",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "step",
                  name: "🔄 Exeggutor",
                  steps: [
                    {
                      type: "step",
                      player:
                        "🪨 use Stealth Rock 🔄 switch to 🕯️ Chandelure 🧠 3x Calm Mind 🧪 give X Speed",
                    },
                  ],
                },
                {
                  type: "step",
                  name: "🔄 Lapras",
                  steps: [
                    {
                      type: "main",
                      player: "🪨 use Stealth Rock",
                      variations: [
                        {
                          type: "step",
                          name: "💥 Aqua Tail",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                            },
                          ],
                        },
                        {
                          type: "step",
                          name: "💥 Drill Run",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 🕯️ Chandelure 🧠 3x Calm Mind 🧪 give X Speed",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          Hariyama: [
            {
              type: "step",
              player:
                "🔁 Trick 🔄 switch to 🕯️ Chandelure 🧠 4x Calm Mind 🧪 give X Speed",
            },
          ],
          Jynx: [
            {
              type: "step",
              player:
                "🔄 Switch to 🕯️ Chandelure 🧠 4x Calm Mind 🧪 give X Speed",
            },
          ],
          Lapras: [
            {
              type: "main",
              player: "🔁 Trick",
              variations: [
                {
                  type: "step",
                  name: "💥 Drill Run",
                  steps: [
                    {
                      type: "main",
                      player:
                        "🔄 switch to ⛏️ Excadrill 🪨 use Stealth Rock 🔄 switch to 🕯️ Chandelure 🧠 3x Calm Mind 🧪 give X Speed",
                      variations: [
                        {
                          type: "step",
                          name: "🔄 Lapras switches to Mantine",
                          steps: [
                            {
                              type: "main",
                              player: "🔄 switch to Blissey ✨ use Softboiled",
                              variations: [
                                {
                                  type: "step",
                                  name: "🔄 Mantine switches to Exeggutor",
                                  steps: [
                                    {
                                      type: "step",
                                      player:
                                        "🔄 switch to 🕯️ Chandelure 🔄 switch to 🤖 Metagross 🔁 use Trick 🔄 switch to 🕯️ Chandelure 🧠 3x Calm Mind 🧪 give X Speed",
                                    },
                                  ],
                                },
                                {
                                  type: "step",
                                  name: "🔄 Mantine switches to Golduck",
                                  steps: [
                                    {
                                      type: "main",
                                      player:
                                        "🔄 switch to 🕯️ Chandelure 🔄 switch to 🥚 Blissey 🔁 use Trick 🔄 switch to 🕯️ Chandelure 🧠 3x Calm Mind 🧪 give X Speed",
                                      variations: [
                                        {
                                          type: "step",
                                          name: "🔄 Golduck switches to Lapras",
                                          steps: [
                                            {
                                              type: "step",
                                              player:
                                                "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  type: "step",
                                  name: "🔄 Mantine switches to Lapras",
                                  steps: [
                                    {
                                      type: "step",
                                      player:
                                        "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "step",
                  name: "💥 Hydro Pump",
                  steps: [
                    {
                      variations: [
                        {
                          type: "step",
                          name: "you get 👓 Choice Specs",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 2nd 🤖 Metagross 🔁 use Trick 🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                            },
                          ],
                        },
                        {
                          type: "step",
                          name: "you get 🔮 Life Orb",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 2nd 🤖 Metagross 🔁 use Trick 🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "step",
                  name: "💥 Surf",
                  steps: [
                    {
                      type: "main",
                      player:
                        "🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                      variations: [
                        {
                          type: "step",
                          name: "🔄 Lapras switches to Dragonite",
                          steps: [
                            {
                              type: "step",
                              player:
                                "🔄 switch to 2nd 🤖 Metagross 🔁 use Trick 🔄 switch to 🥊 Poliwrath 💪 use Belly Drum 🧪 give X Speed",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "step",
                  name: "🔄 Chansey",
                  steps: [{ type: "main", player: "" }],
                },
                {
                  type: "step",
                  name: "🔄 Claydol",
                  steps: [{ type: "main", player: "" }],
                },
                {
                  type: "step",
                  name: "🔄 Dragonite",
                  steps: [{ type: "main", player: "" }],
                },
                {
                  type: "step",
                  name: "🔄 Exegutor",
                  steps: [{ type: "main", player: "" }],
                },
                {
                  type: "step",
                  name: "🔄 Hariyama",
                  steps: [{ type: "main", player: "" }],
                },
                {
                  type: "step",
                  name: "🔄 Togekiss",
                  steps: [{ type: "main", player: "" }],
                },
              ],
            },
          ],
          Lucario: [],
          Magnezone: [],
          Mantine: [],
          Nidoking: [],
          Nidoqueen: [],
          Raichu: [],
          Slowbro: [],
          Togekiss: [],
          Vileplume: [],
        },
      },
      "Team 2": {
        // Placeholder per il Team 2
        pokemonNames: [],
        pokemonStrategies: {},
      },
      "Team 3": {
        // Placeholder per il Team 3
        pokemonNames: [],
        pokemonStrategies: {},
      },
      "Team 4": {
        // Placeholder per il Team 4
        pokemonNames: [],
        pokemonStrategies: {},
      },
      "Team 5": {
        // Placeholder per il Team 5
        pokemonNames: [],
        pokemonStrategies: {},
      },
    },
  },
  {
    name: "Bruno",
    region: "Kanto",
    type: "Lotta",
    image: brunoImage,
    pokemonCardCount: 24,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Aggron",
          "Blastoise",
          "Darmanitan",
          "Eelektross",
          "Electivire",
          "Gliscor",
          "Heracross",
          "Hitmonchan",
          "Hitmonlee",
          "Hitmontop",
          "Infernape",
          "Krookodile",
          "Lucario",
          "Machamp",
          "Metagross",
          "Muk",
          "Rhyperior",
          "Salamence",
          "Seismitoad",
          "Slowbro",
          "Staraptor",
          "Steelix",
          "Torterra",
          "Ursaring",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Agatha",
    region: "Kanto",
    type: "Spettro",
    image: agathaImage,
    pokemonCardCount: 21,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Alakazam",
          "Arbok",
          "Crobat",
          "Fan Rotom",
          "Frost Rotom",
          "Gengar",
          "Golduck",
          "Gyarados",
          "Heat Rotom",
          "Houndoom",
          "Hydreigon",
          "Krookodile",
          "Lucario",
          "Mandibuzz",
          "Marowak",
          "Muk",
          "Seismitoad",
          "Shiftry",
          "Toxicroak",
          "Umbreon",
          "Wash Rotom",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Lance",
    region: "Kanto",
    type: "Drago",
    image: lanceImage,
    pokemonCardCount: 22,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Aerodactyl",
          "Ampharos",
          "Arbok",
          "Arcanine",
          "Charizard",
          "Dragonite",
          "Eelektross",
          "Electivire",
          "Feraligatr",
          "Garchomp",
          "Gyarados",
          "Haxorus",
          "Hydreigon",
          "Infernape",
          "Kingdra",
          "Lapras",
          "Lucario",
          "Metagross",
          "Scizor",
          "Scrafty",
          "Steelix",
          "Tyranitar",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Blue",
    region: "Kanto",
    type: "Astrale",
    image: blueImage,
    pokemonCardCount: 29,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Aerodactyl",
          "Alakazam",
          "Arcanine",
          "Blastoise",
          "Charizard",
          "Electivire",
          "Espeon",
          "Exeggutor",
          "Flareon",
          "Golem",
          "Gyarados",
          "Jolteon",
          "Kingdra",
          "Leafeon",
          "Machamp",
          "Magnezone",
          "Nidoking",
          "Ninetales",
          "Pidgeot",
          "Politoed",
          "Poliwrath",
          "Rhyperior",
          "Sandslash",
          "Scizor",
          "Skarmory",
          "Tyranitar",
          "Umbreon",
          "Vaporeon",
          "Venusaur",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },

  // --- Superquattro di Johto ---
  {
    name: "Will",
    region: "Johto",
    type: "Psico",
    image: willImage,
    pokemonCardCount: 27,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Absol",
          "Altaria",
          "Bronzong",
          "Chansey",
          "Claydol",
          "Clefable",
          "Electivire",
          "Empoleon",
          "Espeon",
          "Exeggutor",
          "Flareon",
          "Gardevoir",
          "Girafarig",
          "Golduck",
          "Golurk",
          "Grumpig",
          "Hypno",
          "Jolteon",
          "Jynx",
          "Liepard",
          "Lucario",
          "Magnezone",
          "Mantine",
          "Slowbro",
          "Typhlosion",
          "Umbreon",
          "Xatu",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Koga",
    region: "Johto",
    type: "Veleno",
    image: kogaImage,
    pokemonCardCount: 35,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Ariados",
          "Bisharp",
          "Crobat",
          "Ditto",
          "Electrode",
          "Ferrothorn",
          "Floatzel",
          "Flygon",
          "Forretress",
          "Gengar",
          "Gliscor",
          "Hypno",
          "Lapras",
          "Lanturn",
          "Lucario",
          "Magmortar",
          "Muk",
          "Nidoking",
          "Nidoqueen",
          "Ninetales",
          "Parasect",
          "Rhyperior",
          "Samurott",
          "Scizor",
          "Sharpedo",
          "Skarmory",
          "Skuntank",
          "Starmie",
          "Stunfisk",
          "Swalot",
          "Tangrowth",
          "Tentacruel",
          "Toxicroak",
          "Venomoth",
          "Weezing",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Bruno",
    region: "Johto",
    type: "Lotta",
    image: brunoImage,
    pokemonCardCount: 27,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Aggron",
          "Blastoise",
          "Blaziken",
          "Darmanitan",
          "Drapion",
          "Eelektross",
          "Electivire",
          "Gliscor",
          "Golem",
          "Heracross",
          "Hitmonchan",
          "Hitmonlee",
          "Hitmontop",
          "Kangaskhan",
          "Krookodile",
          "Lucario",
          "Luxray",
          "Machamp",
          "Metagross",
          "Muk",
          "Poliwrath",
          "Salamence",
          "Seismitoad",
          "Slowbro",
          "Staraptor",
          "Steelix",
          "Torterra",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Karen",
    region: "Johto",
    type: "Buio",
    image: karenImage,
    pokemonCardCount: 29,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Absol",
          "Blastoise",
          "Electrode",
          "Excadrill",
          "Feraligatr",
          "Flareon",
          "Gallade",
          "Garchomp",
          "Gengar",
          "Gyarados",
          "Honchkrow",
          "Houndoom",
          "Hydreigon",
          "Leafeon",
          "Lucario",
          "Luxray",
          "Mismagius",
          "Primeape",
          "Quagsire",
          "Rapidash",
          "Rhyperior",
          "Sableye",
          "Salamence",
          "Slowbro",
          "Tyranitar",
          "Umbreon",
          "Victreebel",
          "Vileplume",
          "Weavile",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Lance",
    region: "Johto",
    type: "Drago",
    image: lanceImage,
    pokemonCardCount: 24,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Aerodactyl",
          "Ampharos",
          "Arbok",
          "Arcanine",
          "Charizard",
          "Dragonite",
          "Eelektross",
          "Electivire",
          "Feraligatr",
          "Flygon",
          "Garchomp",
          "Gyarados",
          "Haxorus",
          "Hydreigon",
          "Infernape",
          "Kangaskhan",
          "Kingdra",
          "Lapras",
          "Lucario",
          "Metagross",
          "Scizor",
          "Scrafty",
          "Steelix",
          "Tyranitar",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },

  // --- Superquattro di Hoenn ---
  {
    name: "Sidney",
    region: "Hoenn",
    type: "Buio",
    image: sidneyImage,
    pokemonCardCount: 28,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Absol",
          "Aggron",
          "Cacturne",
          "Crawdaunt",
          "Darmanitan",
          "Electivire",
          "Excadrill",
          "Garchomp",
          "Golurk",
          "Gyarados",
          "Hariyama",
          "Huntail",
          "Luxray",
          "Magnezone",
          "Mandibuzz",
          "Metagross",
          "Mienshao",
          "Mightyena",
          "Sableye",
          "Salamence",
          "Scizor",
          "Scolipede",
          "Scrafty",
          "Sharpedo",
          "Shiftry",
          "Spiritomb",
          "Tentacruel",
          "Toxicroak",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Phoebe",
    region: "Hoenn",
    type: "Spettro",
    image: phoebeImage,
    pokemonCardCount: 21,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Arcanine",
          "Banette",
          "Chandelure",
          "Dusknoir",
          "Froslass",
          "Honchkrow",
          "Houndoom",
          "Hydreigon",
          "Lucario",
          "Luxray",
          "Mandibuzz",
          "Mawile",
          "Meganium",
          "Mismagius",
          "Ninetales",
          "Raichu",
          "Regice",
          "Sableye",
          "Umbreon",
          "Wash Rotom",
          "Zoroark",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Glacia",
    region: "Hoenn",
    type: "Ghiaccio",
    image: glaciaImage,
    pokemonCardCount: 18,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Abomasnow",
          "Altaria",
          "Beartic",
          "Blissey",
          "Froslass",
          "Gallade",
          "Glalie",
          "Hariyama",
          "Lanturn",
          "Metagross",
          "Mienshao",
          "Mismagius",
          "Nidoqueen",
          "Serperior",
          "Skarmory",
          "Togekiss",
          "Vanilluxe",
          "Walrein",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Drake",
    region: "Hoenn",
    type: "Drago",
    image: drakeImage,
    pokemonCardCount: 21,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Aggron",
          "Altaria",
          "Ampharos",
          "Eelektross",
          "Empoleon",
          "Feraligatr",
          "Floatzel",
          "Flygon",
          "Gallade",
          "Haxorus",
          "Kingdra",
          "Krookodile",
          "Lapras",
          "Lucario",
          "Metagross",
          "Nidoking",
          "Regirock",
          "Salamence",
          "Sceptile",
          "Seviper",
          "Torkoal",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Wallace",
    region: "Hoenn",
    type: "Acqua",
    image: wallaceImage,
    pokemonCardCount: 22,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Altaria",
          "Dragonite",
          "Eelektross",
          "Empoleon",
          "Gardevoir",
          "Gyarados",
          "Lanturn",
          "Ludicolo",
          "Metagross",
          "Mienshao",
          "Milotic",
          "Registeel",
          "Roserade",
          "Seaking",
          "Serperior",
          "Starmie",
          "Swampert",
          "Tentacruel",
          "Togekiss",
          "Wailord",
          "Walrein",
          "Whiscash",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },

  // --- Superquattro di Sinnoh ---
  {
    name: "Aaron",
    region: "Sinnoh",
    type: "Coleottero",
    image: aaronImage,
    pokemonCardCount: 26,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Beautifly",
          "Crawdaunt",
          "Crustle",
          "Drapion",
          "Durant",
          "Dustox",
          "Escavalier",
          "Ferrothorn",
          "Flygon",
          "Forretress",
          "Gastrodon",
          "Gliscor",
          "Heracross",
          "Kabutops",
          "Kingler",
          "Octillery",
          "Omastar",
          "Sceptile",
          "Scizor",
          "Scyther",
          "Skuntank",
          "Steelix",
          "Tyranitar",
          "Vespiquen",
          "Volcarona",
          "Yanmega",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Bertha",
    region: "Sinnoh",
    type: "Terra",
    image: berthaImage,
    pokemonCardCount: 27,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Absol",
          "Amoonguss",
          "Blastoise",
          "Bronzong",
          "Camerupt",
          "Cloyster",
          "Donphan",
          "Druddigon",
          "Durant",
          "Emboar",
          "Forretress",
          "Gengar",
          "Gliscor",
          "Golem",
          "Hippowdon",
          "Nidoking",
          "Parasect",
          "Quagsire",
          "Rhyperior",
          "Sableye",
          "Seismitoad",
          "Skarmory",
          "Steelix",
          "Sudowoodo",
          "Tangrowth",
          "Walrein",
          "Whiscash",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Flint",
    region: "Sinnoh",
    type: "Fuoco",
    image: flintImage,
    pokemonCardCount: 27,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Arcanine",
          "Blaziken",
          "Bouffalant",
          "Bronzong",
          "Cacturne",
          "Camerupt",
          "Charizard",
          "Conkeldurr",
          "Dragonite",
          "Drifblim",
          "Entei",
          "Flareon",
          "Haxorus",
          "Houndoom",
          "Infernape",
          "Lopunny",
          "Lucario",
          "Ludicolo",
          "Magmortar",
          "Maractus",
          "Medicham",
          "Ninetales",
          "Rapidash",
          "Heat Rotom",
          "Salamence",
          "Steelix",
          "Typhlosion",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Lucian",
    region: "Sinnoh",
    type: "Psico",
    image: lucianImage,
    pokemonCardCount: 22,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Absol",
          "Alakazam",
          "Bronzong",
          "Dragonite",
          "Empoleon",
          "Espeon",
          "Gallade",
          "Gardevoir",
          "Girafarig",
          "Golduck",
          "Hydreigon",
          "Kecleon",
          "Lucario",
          "Medicham",
          "Metagross",
          "Mismagius",
          "Ninetales",
          "Noctowl",
          "Raichu",
          "Roserade",
          "Sigilyph",
          "Stantler",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Cynthia",
    region: "Sinnoh",
    type: "Astrale",
    image: cynthiaImage,
    pokemonCardCount: 29,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Aerodactyl",
          "Altaria",
          "Arcanine",
          "Bastiodon",
          "Braviary",
          "Bronzong",
          "Chandelure",
          "Clefable",
          "Eelektross",
          "Excadrill",
          "Garchomp",
          "Gastrodon",
          "Glaceon",
          "Heracross",
          "Jellicent",
          "Lapras",
          "Lickilicky",
          "Lucario",
          "Metagross",
          "Milotic",
          "Mismagius",
          "Nidoqueen",
          "Rayquaza",
          "Roserade",
          "Serperior",
          "Spiritomb",
          "Togekiss",
          "Tyranitar",
          "Umbreon",
          "Vaporeon",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },

  // --- Superquattro di Unima ---
  {
    name: "Shauntal",
    region: "Unova",
    type: "Spettro",
    image: shauntalImage,
    pokemonCardCount: 23,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Absol",
          "Banette",
          "Bisharp",
          "Bronzong",
          "Chandelure",
          "Dragonite",
          "Drifblim",
          "Eelektross",
          "Froslass",
          "Gengar",
          "Golurk",
          "Hydreigon",
          "Jolteon",
          "Liepard",
          "Lucario",
          "Luxray",
          "Milotic",
          "Mismagius",
          "Purugly",
          "Toxicroak",
          "Umbreon",
          "Wash Rotom",
          "Zoroark",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Grimsley",
    region: "Unova",
    type: "Buio",
    image: grimsleyImage,
    pokemonCardCount: 24,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Absol",
          "Bisharp",
          "Chandelure",
          "Crobat",
          "Espeon",
          "Garchomp",
          "Gyarados",
          "Haxorus",
          "Honchkrow",
          "Houndoom",
          "Kingdra",
          "Krookodile",
          "Liepard",
          "Luxray",
          "Mismagius",
          "Roserade",
          "Salamence",
          "Samurott",
          "Scrafty",
          "Serperior",
          "Sharpedo",
          "Spiritomb",
          "Staraptor",
          "Tyranitar",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Caitlin",
    region: "Unova",
    type: "Psico",
    image: caitlinImage,
    pokemonCardCount: 29,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Absol",
          "Alakazam",
          "Altaria",
          "Blissey",
          "Bronzong",
          "Cinccino",
          "Emolga",
          "Empoleon",
          "Entei",
          "Gallade",
          "Gothitelle",
          "Houndoom",
          "Jolteon",
          "Leafeon",
          "Metagross",
          "Mienshao",
          "Milotic",
          "Musharna",
          "Nidoqueen",
          "Raichu",
          "Reuniclus",
          "Serperior",
          "Sigilyph",
          "Slowking",
          "Snorlax",
          "Staraptor",
          "Togekiss",
          "Umbreon",
          "Vaporeon",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Marshal",
    region: "Unova",
    type: "Lotta",
    image: marshalImage,
    pokemonCardCount: 26,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Aggron",
          "Breloom",
          "Carracosta",
          "Conkeldurr",
          "Crawdaunt",
          "Dusknoir",
          "Electivire",
          "Gliscor",
          "Golurk",
          "Gyarados",
          "Haxorus",
          "Krookodile",
          "Lucario",
          "Luxray",
          "Machamp",
          "Magnezone",
          "Medicham",
          "Mienshao",
          "Salamence",
          "Sawk",
          "Seismitoad",
          "Skarmory",
          "Throh",
          "Toxicroak",
          "Tyranitar",
          "Metagross",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
  {
    name: "Alder",
    region: "Unova",
    type: "Astrale",
    image: alderImage,
    pokemonCardCount: 24,
    teams: {
      "Team 1": {
        pokemonNames: [
          "Archeops",
          "Bouffalant",
          "Braviary",
          "Chandelure",
          "Conkeldurr",
          "Dragonite",
          "Druddigon",
          "Escavalier",
          "Excadrill",
          "Feraligatr",
          "Floatzel",
          "Gigalith",
          "Krookodile",
          "Latias",
          "Latios",
          "Lucario",
          "Manectric",
          "Reuniclus",
          "Samurott",
          "Sandslash",
          "Seismitoad",
          "Vanilluxe",
          "Vaporeon",
          "Volcarona",
        ].sort(),
        pokemonStrategies: {},
      },
      "Team 2": { pokemonNames: [], pokemonStrategies: {} },
      "Team 3": { pokemonNames: [], pokemonStrategies: {} },
      "Team 4": { pokemonNames: [], pokemonStrategies: {} },
      "Team 5": { pokemonNames: [], pokemonStrategies: {} },
    },
  },
];
