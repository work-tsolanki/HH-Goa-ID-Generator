"use client";

import { Button, LinkButton } from "./Button";
import Logo from "./Logo";
import type { GenerateResponse } from "./GeneratorFlow";

export default function ResultCard({
  result,
  onStartOver,
}: {
  result: GenerateResponse;
  onStartOver: () => void;
}) {
  const tweetText = `I just built my Hacker House Goa 2026 builder pass — ${result.badgeTitle}. See you 28–31 Oct #FrameInGoa`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(result.shareUrl)}`;

  return (
    <section className="flex flex-1 flex-col bg-green">
      <nav className="flex items-center justify-between px-6 py-6 sm:px-12">
        <Logo />
        <button type="button" onClick={onStartOver} className="text-sm font-medium text-text-dim hover:text-gold">
          Back
        </button>
      </nav>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-7 px-6 py-6 text-center">
        <h1 className="font-display text-2xl text-gold">Your builder pass is ready</h1>

        <a href={result.imageUrl} target="_blank" rel="noopener noreferrer" className="group relative w-full max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote Blob-hosted PNG, not a Next-optimizable local asset */}
          <img
            src={result.imageUrl}
            alt={`${result.name}'s Hacker House Goa 2026 builder pass`}
            className="w-full rounded transition-opacity group-hover:opacity-90"
          />
          <span className="absolute bottom-3 right-3 rounded bg-green/80 px-3 py-1 text-xs text-gold opacity-0 transition-opacity group-hover:opacity-100">
            Tap to view full size
          </span>
        </a>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <LinkButton href={tweetUrl} target="_blank" rel="noopener noreferrer">
            Share to X
          </LinkButton>
          <LinkButton href={result.downloadUrl} download variant="secondary">
            Download PNG
          </LinkButton>
          <Button variant="ghost" onClick={onStartOver} className="self-center">
            Build another card
          </Button>
        </div>
      </div>
    </section>
  );
}
