import Logo from "./Logo";
import { Button } from "./Button";

const HYPE_URL = "https://x.com/search?q=%23FrameInGoa&src=typed_query&f=live";

export default function NavHeader({
  onLogoClick,
  ctaLabel,
  onCtaClick,
}: {
  onLogoClick: () => void;
  ctaLabel: string;
  onCtaClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3.5 border-b-[3px] border-ink bg-paper px-4 py-3.5 sm:px-10">
      <button type="button" onClick={onLogoClick} className="neu neu-btn flex items-center gap-2.5 bg-forest px-3.5 py-2.5">
        <Logo className="text-paper" />
      </button>
      <div className="flex items-center gap-2.5">
        <a
          href={HYPE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="neu neu-btn hidden font-display px-4.5 py-3.5 text-[13px] tracking-[0.04em] text-ink uppercase whitespace-nowrap bg-paper hover:bg-gold sm:inline-flex sm:items-center"
        >
          Check Hype
        </a>
        <Button tone="gold" onClick={onCtaClick} className="whitespace-nowrap">
          {ctaLabel}
        </Button>
      </div>
    </header>
  );
}
