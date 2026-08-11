/** A rising sun with radiating rays and a horizon line — the beach-scene motif behind the hero copy. */
export default function SunHorizon({ className = "" }: { className?: string }) {
  const rays = [-70, -50, -30, -12, 12, 30, 50, 70];

  return (
    <svg viewBox="0 0 400 200" className={className} aria-hidden>
      <g stroke="#d7a53d" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
        {rays.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const inner = 78;
          const outer = angle % 40 === 0 ? 132 : 108;
          const x1 = 200 + inner * Math.sin(rad);
          const y1 = 200 - inner * Math.cos(rad);
          const x2 = 200 + outer * Math.sin(rad);
          const y2 = 200 - outer * Math.cos(rad);
          return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        <line x1="40" y1="200" x2="140" y2="200" />
        <line x1="260" y1="200" x2="360" y2="200" />
      </g>
      <path d="M120 200 A 80 80 0 0 1 280 200 Z" fill="#f4c430" />
      <ellipse cx="200" cy="212" rx="60" ry="8" fill="#f4c430" opacity="0.5" />
      <ellipse cx="200" cy="228" rx="38" ry="5" fill="#f4c430" opacity="0.3" />
    </svg>
  );
}
