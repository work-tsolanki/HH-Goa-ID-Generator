export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-lg leading-none whitespace-nowrap ${className}`}>
      <span className="text-gold">Hacker </span>
      <span className="font-devanagari text-pink normal-case">गोवा</span>
      <span className="text-gold"> House</span>
    </span>
  );
}
