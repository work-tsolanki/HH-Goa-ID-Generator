type Props = {
  className?: string;
  trunkColor?: string;
  leafColor?: string;
  flip?: boolean;
};

/** A flat-vector palm silhouette — the beach-scene motif carried from the card into the homepage. */
export default function PalmTree({
  className = "",
  trunkColor = "#0f2b1f",
  leafColor = "#1f5c41",
  flip = false,
}: Props) {
  return (
    <svg
      viewBox="0 0 220 320"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <path
        d="M118 320 C 108 230 96 170 132 96 C 140 80 138 62 128 50"
        fill="none"
        stroke={trunkColor}
        strokeWidth="14"
        strokeLinecap="round"
      />
      {[
        { r: -70, s: 1.05 },
        { r: -35, s: 1.15 },
        { r: -5, s: 1.2 },
        { r: 25, s: 1.1 },
        { r: 55, s: 0.95 },
        { r: 80, s: 0.8 },
      ].map((f, i) => (
        <g key={i} transform={`translate(128 50) rotate(${f.r}) scale(${f.s})`}>
          <path
            d="M0 0 C 30 -10 70 -6 108 8 C 78 14 46 12 20 22 C 46 20 76 26 100 42 C 68 40 38 30 14 34 C 32 40 54 52 68 68 C 40 56 18 40 0 24 Z"
            fill={leafColor}
          />
        </g>
      ))}
    </svg>
  );
}
