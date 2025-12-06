const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  if (Math.abs(endAngle - startAngle) >= 359.99) {
    return `M ${x} ${y} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
  }

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${x} ${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

const StatCircle = ({ ivColors, onClick, isActive, isDimmed }) => {
  const centerX = 25;
  const centerY = 25;
  const radius = 22;

  const numSectors = ivColors.length;
  const sectorAngle = 360 / numSectors;

  // Tailwind classes for state
  const baseClasses = "bg-slate-800 rounded-full shadow-md cursor-pointer relative transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.27)] z-[2]";
  const hoverClasses = "group-hover/node:shadow-lg group-hover/node:scale-125 group-hover/node:z-[100]";
  const activeClasses = isActive ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] opacity-100 stroke-white stroke-2 scale-115 z-[50]" : "";
  const dimmedClasses = isDimmed ? "grayscale opacity-20 scale-90" : "";

  // We'll use inline style for width/height since they might be dynamic in TreeScheme, 
  // but here they are fixed props in the original CSS as var(--node-size, 40px).
  // TreeScheme passes style={{ "--node-size": ... }} to parent. 
  // SVG fills the container so we just need the container to have the size.
  // Wait, StatCircle IS the SVG. The original CSS applied size to the SVG class.
  // We can use w-[var(--node-size,40px)] h-[var(--node-size,40px)].

  return (
    <svg
      className={`${baseClasses} ${hoverClasses} ${activeClasses} ${dimmedClasses} w-[var(--node-size,40px)] h-[var(--node-size,40px)]`}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      {ivColors.map((color, idx) => {
        const startAngle = idx * sectorAngle;
        const endAngle = (idx + 1) * sectorAngle;

        const pathData = describeArc(
          centerX,
          centerY,
          radius,
          startAngle,
          endAngle
        );

        return (
          <path
            key={idx}
            d={pathData}
            fill={color}
            stroke="#1a1a1a"
            strokeWidth="0.5"
          />
        );
      })}

      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={isActive ? "#ffffff" : "#e4e6eb"}
        strokeWidth="2"
      />
    </svg>
  );
};

export default StatCircle;