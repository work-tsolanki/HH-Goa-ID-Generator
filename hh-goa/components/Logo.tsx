export default function Logo({ className = "", size = 15 }: { className?: string; size?: number }) {
  // Fluid, not fixed: on narrow phones a nowrap wordmark at a flat px size is
  // what pushes the header into horizontal overflow (confirmed on-device —
  // the CTA button next to it gets clipped off the right edge). clamp()
  // keeps the full size on tablet/desktop but lets it shrink with the
  // viewport below that, same as every other type scale in this system.
  const min = Math.round(size * 0.68);
  return (
    <span
      className={`font-display leading-none whitespace-nowrap normal-case ${className}`}
      style={{ fontSize: `clamp(${min}px, 3.6vw, ${size}px)` }}
    >
      HACKER HOUSE{" "}
      <span className="font-devanagari text-pink normal-case" style={{ fontSize: "0.93em" }}>
        गोवा
      </span>{" "}
      26
    </span>
  );
}
