/**
 * Fixed full-viewport paper texture shared by every screen: a dot-grid,
 * a rotated gold band with a hazard-stripe shadow, a pink halftone
 * corner, and two oversized watermarks (PASS / गोवा). Mounted once in
 * the root layout — position:fixed means it never needs to be repeated
 * per route.
 */
export default function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-paper-deep"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to right, rgba(16,16,16,.07) 0 1px, transparent 1px 48px), repeating-linear-gradient(to bottom, rgba(16,16,16,.07) 0 1px, transparent 1px 48px)",
      }}
    >
      <div
        className="absolute -left-[12%] -right-[12%] top-[26%] h-[230px] border-t-[3px] border-b-[3px] border-ink bg-gold opacity-25"
        style={{ transform: "rotate(-7deg)" }}
      />
      <div
        className="absolute -left-[12%] -right-[12%] h-[26px] opacity-15"
        style={{
          top: "calc(26% + 250px)",
          backgroundImage: "repeating-linear-gradient(45deg, #101010 0 12px, transparent 12px 24px)",
          transform: "rotate(-7deg)",
        }}
      />
      <div
        className="absolute -right-[60px] -bottom-[40px] h-[460px] w-[460px] opacity-40"
        style={{
          backgroundImage: "radial-gradient(#FF0080 2.6px, transparent 2.7px)",
          backgroundSize: "19px 19px",
          WebkitMaskImage: "radial-gradient(circle at 78% 82%, #000, transparent 68%)",
          maskImage: "radial-gradient(circle at 78% 82%, #000, transparent 68%)",
        }}
      />
      <span
        className="absolute -left-[26px] -bottom-14 font-display leading-[0.8] text-transparent uppercase"
        style={{
          fontSize: "clamp(150px, 24vw, 320px)",
          WebkitTextStroke: "2px rgba(16,16,16,.15)",
          transform: "rotate(-6deg)",
          letterSpacing: "-.04em",
        }}
      >
        PASS
      </span>
      <span
        className="font-devanagari absolute top-6 right-10 leading-none"
        style={{
          fontSize: "clamp(90px, 13vw, 170px)",
          color: "rgba(255,0,128,.09)",
          transform: "rotate(6deg)",
        }}
      >
        गोवा
      </span>
    </div>
  );
}
