import "./IVsSelector.css";

// * ============================================
// * MATH HELPERS (SVG Geometry)
// * ============================================

// ? Helper: Converts Polar coordinates (angle/radius) to Cartesian (x/y)
// Used to find the points on the circle's circumference.
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// ? Helper: Generates the SVG 'd' path command for a pie slice (arc)
const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  // * Handle case where the arc is a full circle (close to 360 degrees)
  if (Math.abs(endAngle - startAngle) >= 359.99) {
    return `M ${x} ${y} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${
      radius * 2
    },0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
  }

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  // * Construct standard SVG Path command
  return [
    `M ${x} ${y}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
};

// * ============================================
// * COMPONENT: StatCircle
// * Renders a circular node composed of colored sectors representing IVs.
// * ============================================
const StatCircle = ({ ivColors, index, onClick, isActive, isDimmed }) => {
  // * Geometry Constants
  const centerX = 25;
  const centerY = 25;
  const radius = 22;

  // * Sector Calculation
  const numSectors = ivColors.length;
  const sectorAngle = 360 / numSectors;
  let currentAngle = 0;

  // ! Dynamic Classes based on Props
  const activeClass = isActive ? "is-active" : "";
  const dimmedClass = isDimmed ? "is-dimmed" : "";

  return (
    <svg
      key={index}
      // * Combine base class with dynamic state classes
      className={`tree-stat-circle ${activeClass} ${dimmedClass}`}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick} // ? User Interaction Trigger
    >
      {/* * Loop: Render each IV as a colored slice of the pie */}
      {ivColors.map((color, idx) => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + sectorAngle;
        currentAngle = endAngle;

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

      {/* * Outer Ring / Border */}
      {/* Changes color to white when active to highlight selection */}
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
