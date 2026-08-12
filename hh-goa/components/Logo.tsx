export default function Logo({ className = "", size = 15 }: { className?: string; size?: number }) {
  return (
    <span
      className={`font-display leading-none whitespace-nowrap normal-case ${className}`}
      style={{ fontSize: size }}
    >
      HACKER HOUSE{" "}
      <span className="font-devanagari text-pink normal-case" style={{ fontSize: size * 0.93 }}>
        गोवा
      </span>{" "}
      26
    </span>
  );
}
