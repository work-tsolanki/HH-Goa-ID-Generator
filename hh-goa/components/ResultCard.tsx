"use client";

import PostcardLogo from "./PostcardLogo";
import type { GenerateResponse } from "./GeneratorFlow";

export default function ResultCard({
  result,
  onStartOver,
}: {
  result: GenerateResponse;
  onStartOver: () => void;
}) {
  const tweetText = `I just built my Hacker House Goa 2026 badge — ${result.badgeTitle}. See you 28–31 Oct 🌴 #FrameInGoa`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(result.shareUrl)}`;

  return (
    <section className="relative flex flex-1 flex-col bg-cream">
      <div className="dot-field pointer-events-none absolute inset-0" aria-hidden />

      <header className="sticky top-0 z-20 flex items-center justify-between border-b-4 border-gold bg-green px-5 py-4 sm:px-8">
        <PostcardLogo dark />
        <button type="button" onClick={onStartOver} className="text-sm font-bold text-gold">
          ← Home
        </button>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center gap-6 px-6 py-8 text-center">
        <h1 className="font-display text-2xl font-bold text-green">Your builder pass is ready</h1>

        <a
          href={result.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-full max-w-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- remote Blob-hosted PNG, not a Next-optimizable local asset */}
          <img
            src={result.imageUrl}
            alt={`${result.name}'s Hacker House Goa 2026 card`}
            className="w-full rounded-2xl border-2 border-green/10 shadow-xl transition-opacity group-hover:opacity-90"
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
            Tap to view full size
          </span>
        </a>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-pink px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink/30 transition-transform active:scale-95"
          >
            Share to X
          </a>
          <a
            href={result.downloadUrl}
            download
            className="rounded-full border-2 border-green px-8 py-3.5 text-base font-bold text-green transition-transform active:scale-95"
          >
            Download PNG
          </a>
          <button
            type="button"
            onClick={onStartOver}
            className="text-sm font-semibold text-green/60"
          >
            Build another card
          </button>
        </div>
      </div>
    </section>
  );
}
