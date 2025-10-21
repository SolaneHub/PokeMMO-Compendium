// StatCircle.jsx

// Funzione helper per convertire coordinate polari in cartesiane
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

// Funzione per disegnare un arco (settore) di un cerchio in SVG
const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    // Se l'angolo è 360 (un cerchio completo) o quasi, usa una logica semplificata per evitare errori di rendering
    if (Math.abs(endAngle - startAngle) >= 359.99) {
        return `M ${x} ${y} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
    }

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    // Crea la stringa del percorso SVG (M = muovi, L = linea, A = arco)
    const d = [
        `M ${x} ${y}`, // Sposta al centro
        `L ${start.x} ${start.y}`, // Linea dal centro al punto di inizio
        `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, // Arco
        'Z', // Chiudi il percorso (torna al centro)
    ].join(' ');

    return d;
}

const StatCircle = ({ ivColors, index }) => {
    const centerX = 25;
    const centerY = 25;
    const radius = 22;
    const numSectors = ivColors.length;
    const sectorAngle = 360 / numSectors;
    let currentAngle = 0;

    return (
        <svg
            key={index}
            className="tree-stat-circle"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Disegna i settori colorati (fette di torta) */}
            {ivColors.map((color, idx) => {
                const startAngle = currentAngle;
                const endAngle = currentAngle + sectorAngle;
                currentAngle = endAngle; 

                const pathData = describeArc(centerX, centerY, radius, startAngle, endAngle);

                return (
                    <path
                        key={idx}
                        d={pathData}
                        fill={color}
                        stroke="#1a1a1a" // Bordo scuro tra i settori
                        strokeWidth="0.5"
                    />
                );
            })}
            
            {/* Cerchio di contorno esterno per evidenziare il nodo */}
            <circle 
                cx={centerX} 
                cy={centerY} 
                r={radius} 
                fill="none" 
                stroke="#e4e6eb" 
                strokeWidth="2" 
            />
        </svg>
    );
};

export default StatCircle;