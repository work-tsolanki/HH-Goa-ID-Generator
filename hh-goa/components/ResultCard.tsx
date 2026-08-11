"use client";

import { TerminalButton, TerminalLinkButton } from "./TerminalButton";
import TerminalTitleBar from "./TerminalTitleBar";
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
    <section className="scanlines relative flex flex-1 flex-col bg-bg">
      <TerminalTitleBar
        filename="output.png"
        status="READY"
        action={
          <button type="button" onClick={onStartOver} className="text-sm text-text-dim hover:text-amber">
            cd ..
          </button>
        }
      />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center gap-6 px-6 py-8 text-center">
        <h1 className="text-xl font-bold text-text-bright">$ ./output.png &mdash; ready</h1>

        <a href={result.imageUrl} target="_blank" rel="noopener noreferrer" className="group relative w-full max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote Blob-hosted PNG, not a Next-optimizable local asset */}
          <img
            src={result.imageUrl}
            alt={`${result.name}'s Hacker House Goa 2026 builder pass`}
            className="w-full border border-hairline transition-opacity group-hover:opacity-90"
          />
          <span className="absolute bottom-3 right-3 bg-bg/80 px-3 py-1 text-xs text-amber opacity-0 transition-opacity group-hover:opacity-100">
            tap to view full size
          </span>
        </a>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <TerminalLinkButton href={tweetUrl} target="_blank" rel="noopener noreferrer">
            share_to_x
          </TerminalLinkButton>
          <TerminalLinkButton href={result.downloadUrl} download variant="secondary">
            download.png
          </TerminalLinkButton>
          <TerminalButton variant="ghost" onClick={onStartOver}>
            ./build-another.sh
          </TerminalButton>
        </div>
      </div>
    </section>
  );
}
