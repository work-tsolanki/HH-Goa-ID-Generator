/**
 * An authored beach/resort scene with a developer coding under a palm —
 * composition inspired by hhgoa.com's own illustrated panorama (sun,
 * palms, shack, surfboards), redrawn from scratch for this product with
 * a "hacker" detail folded in: a figure coding on a laptop at the shack
 * counter, screen showing a few lines of code instead of a drink menu.
 */
export default function BeachHeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 460" className={className} aria-hidden>
      {/* horizon + sea */}
      <rect x="0" y="0" width="1200" height="460" fill="#0d3b28" />
      <path d="M0 210 Q600 170 1200 210 L1200 300 L0 300 Z" fill="#134e34" />
      <path d="M0 240 Q600 205 1200 240 L1200 300 L0 300 Z" fill="#0f4029" />

      {/* sun + rays + reflection */}
      <g stroke="#f4c430" strokeWidth="2.5" opacity="0.85">
        <line x1="600" y1="70" x2="600" y2="40" />
        <line x1="655" y1="80" x2="678" y2="55" />
        <line x1="545" y1="80" x2="522" y2="55" />
        <line x1="690" y1="115" x2="720" y2="102" />
        <line x1="510" y1="115" x2="480" y2="102" />
      </g>
      <circle cx="600" cy="150" r="62" fill="#f4c430" />
      <ellipse cx="600" cy="240" rx="70" ry="10" fill="#f4c430" opacity="0.55" />
      <ellipse cx="600" cy="256" rx="44" ry="6" fill="#f4c430" opacity="0.32" />

      {/* sand */}
      <path d="M0 300 Q600 260 1200 300 L1200 460 L0 460 Z" fill="#f4f1ea" />
      <path d="M0 320 Q600 288 1200 320 L1200 460 L0 460 Z" fill="#e7e0cd" opacity="0.6" />

      {/* background palms */}
      <g opacity="0.55">
        <Palm x={140} y={280} scale={0.6} color="#1f5c3f" />
        <Palm x={1040} y={270} scale={0.55} flip color="#1f5c3f" />
      </g>

      {/* foreground palms framing the scene */}
      <Palm x={70} y={330} scale={1.05} color="#134e34" />
      <Palm x={1120} y={325} scale={1.1} flip color="#134e34" />

      {/* surfboards leaning on the shack */}
      <g transform="translate(830,255) rotate(-8)">
        <rect x="0" y="0" width="20" height="120" rx="10" fill="#ec1e79" />
        <rect x="7" y="16" width="6" height="90" rx="3" fill="#f4f1ea" opacity="0.7" />
      </g>
      <g transform="translate(858,258) rotate(-4)">
        <rect x="0" y="0" width="20" height="118" rx="10" fill="#f4c430" />
        <rect x="7" y="16" width="6" height="88" rx="3" fill="#0d3b28" opacity="0.5" />
      </g>

      {/* beach shack */}
      <g transform="translate(870,220)">
        <polygon points="0,60 110,60 95,15 15,15" fill="#134e34" stroke="#0d3b28" strokeWidth="2" />
        <rect x="10" y="60" width="90" height="90" fill="#f4c430" stroke="#0d3b28" strokeWidth="2" />
        <rect x="18" y="72" width="74" height="14" fill="#0d3b28" />
        <text x="55" y="83" textAnchor="middle" fontSize="9" fill="#f4c430" fontFamily="monospace">
          HH GOA CAFE
        </text>
        {/* counter */}
        <rect x="18" y="118" width="74" height="10" fill="#0d3b28" />
        <rect x="14" y="128" width="6" height="22" fill="#0d3b28" />
        <rect x="90" y="128" width="6" height="22" fill="#0d3b28" />
      </g>

      {/* the developer, coding at the counter (counter sits at absolute y=348-358, x=888-962) */}
      <g transform="translate(925,300)">
        {/* stool legs */}
        <rect x="14" y="40" width="4" height="18" fill="#092c1d" />
        <rect x="26" y="40" width="4" height="18" fill="#092c1d" />
        {/* seated body */}
        <path d="M10 40 Q10 16 22 16 Q34 16 34 40 Z" fill="#ec1e79" />
        <circle cx="22" cy="8" r="9" fill="#f4f1ea" />
        {/* laptop, open on the counter */}
        <g transform="translate(6,30)">
          <rect x="-2" y="6" width="36" height="5" rx="1.5" fill="#092c1d" />
          <path d="M0 6 L3 -16 L29 -16 L32 6 Z" fill="#f4f1ea" />
          <rect x="7" y="-13" width="18" height="14" rx="1" fill="#092c1d" />
          <line x1="10" y1="-9" x2="19" y2="-9" stroke="#39d372" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="10" y1="-6" x2="22" y2="-6" stroke="#39d372" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
          <line x1="10" y1="-3" x2="16" y2="-3" stroke="#39d372" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
        </g>
      </g>

      {/* walking figure, for scale/life */}
      <g transform="translate(300,340)" opacity="0.55">
        <circle cx="0" cy="-24" r="5" fill="#0d3b28" />
        <path d="M0 -19 L0 0 M0 -12 L-8 -4 M0 -12 L8 -6 M0 0 L-6 14 M0 0 L6 12" stroke="#0d3b28" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

function Palm({
  x,
  y,
  scale = 1,
  flip = false,
  color = "#134e34",
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  color?: string;
}) {
  return (
    <g transform={`translate(${x},${y}) scale(${(flip ? -1 : 1) * scale}, ${scale})`}>
      <path
        d="M6 170 C -8 100 4 40 16 0"
        fill="none"
        stroke="#5f3d22"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {[
        [-1, -0.15],
        [-0.6, -0.9],
        [-0.05, -1.15],
        [0.55, -0.9],
        [1, -0.2],
      ].map(([fx, fy], i) => {
        const size = 130;
        const cx1 = 16 + fx * size * 0.55;
        const cy1 = fy * size * 0.35;
        const ex = 16 + fx * size * 0.72;
        const ey = fy * size * 0.72;
        const cx2 = 16 + fx * size * 0.32;
        const cy2 = fy * size * 0.48;
        return (
          <path
            key={i}
            d={`M16,0 Q${cx1},${cy1} ${ex},${ey} Q${cx2},${cy2} 16,0 Z`}
            fill={color}
          />
        );
      })}
    </g>
  );
}
