export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-[15px] leading-none whitespace-nowrap normal-case ${className}`}>
      HACKER HOUSE{" "}
      <span className="font-devanagari text-pink normal-case" style={{ fontSize: "14px" }}>
        गोवा
      </span>{" "}
      26
    </span>
  );
}
