"use client";

import { useState } from "react";
import { buildTweetText, buildTweetUrl } from "@/lib/tweet";
import { Button, LinkButton } from "./Button";
import type { GenerateResponse } from "./GeneratorFlow";

const PARTICLES: Array<{ icon: string; style: string; delay: string }> = [
  { icon: "🌴", style: "left-[-8%] bottom-[18%]", delay: "0s" },
  { icon: "☀️", style: "right-[-4%] top-[8%]", delay: "0.35s" },
  { icon: "🌊", style: "left-[8%] bottom-[-4%]", delay: "0.7s" },
  { icon: "🐚", style: "right-[6%] bottom-[-2%]", delay: "1.05s" },
];

export default function ResultCard({
  result,
  onStartOver,
}: {
  result: GenerateResponse;
  onStartOver: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const tweetText = buildTweetText(result);
  const tweetUrl = buildTweetUrl(tweetText, result.shareUrl);
  const shareHost = result.shareUrl.replace(/^https?:\/\//, "");

  return (
    <main className="animate-pop-in relative z-1 flex flex-1 flex-col items-center gap-7 px-4 pt-6.5 pb-24 sm:px-10 sm:pt-13">
      <div className="animate-reveal relative w-full max-w-[410px]">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            aria-hidden
            className={`animate-bob pointer-events-none absolute z-3 text-[26px] ${p.style}`}
            style={{ animationDelay: p.delay }}
          >
            {p.icon}
          </span>
        ))}
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

      <span className="font-body max-w-sm text-center text-[12px] font-semibold opacity-70">
        X takes a few seconds to load your pass image the first time — wait for the preview card to
        appear in the compose box before you hit Post.
      </span>

      <span className="font-body text-[11px] font-bold tracking-[0.22em] opacity-60">
        {result.builderCode} · SHARE PAGE: {shareHost}
      </span>
    </main>
  );
}
