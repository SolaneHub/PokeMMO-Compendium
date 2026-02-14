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
const StatCircle = ({
  ivColors,
  onClick,
  isActive,
  isDimmed,
  size,
  className = "",
}) => {
  const viewBoxSize = 50;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const radius = 24;
  const numSectors = ivColors.length;
  if (numSectors === 0) return null;
  const sectorAngle = 360 / numSectors;
  const baseStyle = size ? { width: size, height: size } : {};
  const containerClasses = ` relative rounded-full transition-all duration-300 ease-out ${onClick ? "cursor-pointer hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:z-50" : ""} ${isActive ? "scale-110 shadow-[0_0_20px_rgba(59,130,246,0.6)] ring-2 ring-white z-40" : "shadow-md"} ${isDimmed ? "opacity-20 grayscale scale-90 blur-[1px]" : "opacity-100"} ${!size ? "w-[var(--node-size,40px)] h-[var(--node-size,40px)]" : ""} ${className} `;
  return (
    <div className={containerClasses} style={baseStyle} onClick={onClick}>
      {" "}
      <svg
        className="h-full w-full drop-shadow-sm"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
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
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.5"
            />
          );
        })}{" "}
        {/* Center hole or border overlay for style */}{" "}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={isActive ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.1)"}
          strokeWidth="1"
        />{" "}
      </svg>{" "}
    </div>
  );
};
export default StatCircle;
