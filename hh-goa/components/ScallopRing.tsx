import { COLORS } from "@/lib/card/theme";

/** The card's own scalloped rickrack photo ring, reused in the chrome — same device that frames every generated card, framing the live preview before it's even rendered. */
export default function ScallopRing({ className = "" }: { className?: string }) {
  const outerR = 48;
  const innerR = 41;
  const ringMid = (outerR + innerR) / 2;
  const bumpR = (outerR - innerR) / 2 + 0.6;
  const circumference = 2 * Math.PI * ringMid;
  const count = Math.max(20, Math.round(circumference / (bumpR * 1.35)));

  const bumps = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return {
      cx: 50 + ringMid * Math.cos(angle),
      cy: 50 + ringMid * Math.sin(angle),
      fill: i % 2 === 0 ? COLORS.red : COLORS.white,
    };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    >
      {bumps.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={bumpR} fill={b.fill} />
      ))}
    </svg>
  );
}
