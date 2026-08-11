export default function PostcardLogo({ dark = false }: { dark?: boolean }) {
  const base = dark ? "text-gold" : "text-green";
  return (
    <div className={`font-display font-bold uppercase leading-[0.8] tracking-tight ${base}`}>
      <div className="text-base sm:text-lg">Hacker</div>
      <div className="font-devanagari text-pink text-sm normal-case sm:text-base">गोवा</div>
      <div className="text-base sm:text-lg">House</div>
    </div>
  );
}
