"use client";

import { useState } from "react";
import { Button, LinkButton } from "./Button";
import type { GenerateResponse } from "./GeneratorFlow";

export default function ResultCard({
  result,
  onStartOver,
}: {
  result: GenerateResponse;
  onStartOver: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const tweetText = `I just built my Hacker House Goa 2026 builder pass — ${result.badgeTitle}. See you 28–31 Oct #FrameInGoa`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(result.shareUrl)}`;
  const shareHost = result.shareUrl.replace(/^https?:\/\//, "");

  return (
    <main className="animate-pop-in relative z-1 flex flex-1 flex-col items-center gap-7 px-4 pt-6.5 pb-24 sm:px-10 sm:pt-13">
      <div className="animate-reveal relative w-full max-w-[410px]">
        <span className="neu font-display absolute bottom-full left-[-18px] z-4 mb-3.5 bg-pink px-4 py-3.5 text-[15px] text-paper">
          PASS READY ✓
        </span>
        <div className="neu overflow-hidden bg-[#F8EFDC]" style={{ boxShadow: "14px 14px 0 var(--color-ink)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- remote Blob-hosted PNG, not a Next-optimizable local asset */}
          <img
            src={result.imageUrl}
            alt={`${result.name}'s Hacker House Goa 2026 builder pass`}
            className="block w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3.5">
        <LinkButton href={tweetUrl} target="_blank" rel="noopener noreferrer" tone="pink" size="lg" className="neu-lg">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path d="M18.2 2H21l-6.5 7.4L21.7 22H15l-4.6-6.3L4.9 22H2l7-8L2 2h6.8l4.3 5.9zM17 20.2h1.6L6.9 3.7H5.2z" />
          </svg>
          Share To X
        </LinkButton>
        <LinkButton
          href={result.downloadUrl}
          download
          tone={saved ? "forest" : "gold"}
          size="lg"
          className="neu-lg"
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2600);
          }}
        >
          {saved ? "Saved ✓" : "Download PNG"}
        </LinkButton>
        <Button type="button" tone="paper" size="lg" className="neu-lg" onClick={onStartOver}>
          Build Another
        </Button>
      </div>

      <span className="font-body text-[11px] font-bold tracking-[0.22em] opacity-60">
        {result.builderCode} · SHARE PAGE: {shareHost}
      </span>
    </main>
  );
}
