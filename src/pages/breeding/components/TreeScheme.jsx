import { useCallback } from "react";
import StatCircle from "./StatCircle";
import "./TreeScheme.css";

const STAT_COLOR_MAP = {
  HP: "#55b651",
  Attack: "#f72533",
  Defense: "#f78025",
  "Sp. Attack": "#e925f7",
  "Sp. Defense": "#f7e225",
  Speed: "#25e2f7",
};

const GAP_VALUES = [60, 170, 390, 830, 1710, 3470]; // valori reali osservati

const getColors = (stats) =>
  stats.map((stat) => STAT_COLOR_MAP[stat] || "#ffffff");

function TreeScheme({ selectedIvCount, selectedIvStats, nature }) {
  const scaleValues = {
    2: 1,
    3: 1,
    4: 1,
    5: 0.8,
    6: 0.55,
  };

  const scaleValuesNature = {
    2: 1,
    3: 1,
    4: 0.75,
    5: 0.55,
    6: 0.27,
  };

  const scale = nature
    ? scaleValuesNature[selectedIvCount]
    : scaleValues[selectedIvCount];

  const generateTree = useCallback(
    (selectedIvCount, selectedIvStats, nature) => {
      // 1. Limitiamo comunque a max 6 IV, per sicurezza
      const clampedCount = Math.min(selectedIvCount ?? 0, 6);

      // 2. Prendiamo solo gli IV effettivamente selezionati
      const baseStats = selectedIvStats.slice(0, clampedCount);

      // 3. Se la nature è attiva, la mettiamo DAVANTI
      //    così il cerchio singolo della nature sarà il primo in alto.
      //
      //    "Nature" non è in STAT_COLOR_MAP, quindi getColors("Nature")
      //    restituisce "#ffffff", esattamente come prima quando passavi il booleano.
      const stats = nature ? ["Nature", ...baseStats] : baseStats;

      // Se non ci sono stat, non disegno niente
      if (stats.length === 0) return [];

      // 4. Costruisco un albero binario completo:
      //    - livello 0: [stats]
      //    - ogni nodo con length > 1 genera:
      //        left  = tutti tranne l'ultimo
      //        right = tutti tranne il primo
      const levels = [];
      let currentLevel = [stats];

      while (currentLevel.length > 0) {
        levels.push(currentLevel);

        const nextLevel = [];

        currentLevel.forEach((nodeStats) => {
          if (nodeStats.length > 1) {
            const leftChild = nodeStats.slice(0, -1);
            const rightChild = nodeStats.slice(1);
            nextLevel.push(leftChild, rightChild);
          }
        });

        currentLevel = nextLevel;
      }

      // 5. Converto ogni nodo in colori e inverto le righe:
      //    - in cima avrai i cerchi singoli (foglie)
      //    - sotto via via quelli più "pieni"
      const coloredLevels = levels
        .map((level) => level.map((nodeStats) => getColors(nodeStats)))
        .reverse();

      return coloredLevels;
    },
    []
  );

  const dataByRow = generateTree(selectedIvCount, selectedIvStats, nature);

  const legendData = selectedIvStats
    .slice(0, selectedIvCount)
    .map((statName) => ({
      name: statName,
      colors: [STAT_COLOR_MAP[statName]],
    }));

  return (
    <div className="tree-scheme-container">
      {/* Legenda */}
      <div className="legend-container">
        <div className="legend-items">
          {legendData.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="legend-stat-name">{item.name}</span>
              <StatCircle
                ivColors={item.colors}
                index={`legend-${index}`}
                isLegend
              />
            </div>
          ))}
        </div>
      </div>

      {/* Albero a righe (verticale) */}

      <div className="tree-wrapper">
        <div className="tree-container" style={{ "--scale": scale }}>
          {dataByRow.map((rowItems, rowIndex) => {
            const rowGap =
              GAP_VALUES[rowIndex] || GAP_VALUES[GAP_VALUES.length - 1];
            return (
              <div
                key={`row-${rowIndex}`}
                className="tree-row"
                style={{ "--gap": `${rowGap}px` }}
              >
                {rowItems.reduce((pairs, colors, i) => {
                  if (i % 2 === 0) {
                    const next = rowItems[i + 1];
                    pairs.push(
                      <div
                        className="tree-pair"
                        key={`${rowIndex}-pair-${i / 2}`}
                      >
                        <div className="tree-node">
                          <StatCircle
                            ivColors={colors}
                            index={`${rowIndex}-${i}`}
                          />
                        </div>
                        {next && (
                          <div className="tree-node">
                            <StatCircle
                              ivColors={next}
                              index={`${rowIndex}-${i + 1}`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }
                  return pairs;
                }, [])}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TreeScheme;
