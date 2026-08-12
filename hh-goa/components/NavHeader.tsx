"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import Logo from "./Logo";

export default function NavHeader({
  onLogoClick,
  ctaLabel,
  onCtaClick,
}: {
  onLogoClick: () => void;
  ctaLabel: string;
  onCtaClick: () => void;
}) {
  const [hypeOpen, setHypeOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isLanding = ctaLabel === "CREATE";

  useEffect(() => {
    if (!hypeOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setHypeOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hypeOpen]);

  function openHype() {
    setMuted(false);
    setHypeOpen(true);
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-1.5 border-b-[3px] border-ink px-2.5 py-3 sm:gap-3.5 sm:px-10 sm:py-3.5">
        <button
          type="button"
          onClick={onLogoClick}
          className="neu neu-btn flex min-w-0 items-center gap-2 bg-forest px-2 py-2 sm:gap-2.5 sm:px-3.5 sm:py-2.5"
        >
          <Logo className="text-paper" />
        </button>
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* On phone there's only room for one right-side action. The
              landing step already has its own "Create My Pass" button in
              the hero, so the header CTA there is redundant — swap it for
              Check Hype, which was otherwise unreachable on mobile
              (hidden below sm). "Start Over" has no such duplicate, so it
              keeps the slot on the build/result steps. */}
          <button
            type="button"
            onClick={openHype}
            className={`neu neu-btn font-display px-4.5 py-3.5 text-[13px] tracking-[0.04em] text-ink uppercase whitespace-nowrap bg-paper hover:bg-gold sm:inline-flex sm:items-center ${
              isLanding ? "inline-flex items-center" : "hidden"
            }`}
          >
            Check Hype
          </button>
          <span className={isLanding ? "hidden sm:inline-flex" : "inline-flex"}>
            <Button tone="gold" onClick={onCtaClick} className="whitespace-nowrap">
              {ctaLabel}
            </Button>
          </span>
        </div>
      </header>

      {hypeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4 py-8"
          onClick={() => setHypeOpen(false)}
        >
          <div className="neu neu-lg w-full max-w-2xl bg-ink" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-2.5 border-b-[3px] border-ink bg-paper px-3.5 py-2.5">
              <span className="font-display text-[13px] tracking-[0.04em] uppercase">HH Goa Hype Reel</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  aria-pressed={muted}
                  className="neu neu-btn bg-forest text-paper flex h-10 w-10 items-center justify-center font-display text-[15px]"
                >
                  {muted ? "🔇" : "🔊"}
                </button>
                <button
                  type="button"
                  onClick={() => setHypeOpen(false)}
                  aria-label="Close"
                  className="neu neu-btn bg-gold text-ink flex h-10 w-10 items-center justify-center font-display text-[16px]"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-hidden">
              <video
                ref={videoRef}
                src="/frame-generator/prehype.mp4"
                autoPlay
                muted={muted}
                playsInline
                className="block w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}