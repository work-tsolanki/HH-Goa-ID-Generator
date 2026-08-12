"use client";

import { useEffect, useState } from "react";
import { buildTweetText, buildTweetUrl, type TweetCardFacts } from "@/lib/tweet";
import { LinkButton } from "./Button";

/**
 * X's link-card unfurl (og:image) is boxed to a landscape ratio by X itself
 * — a portrait image gets center-cropped there no matter what we serve, X's
 * timeline card renderer enforces that box. The only way to post the actual
 * portrait pass uncropped is to attach it as native media instead of a link
 * card, which the Web Share API can do when the platform supports sharing
 * files: the OS share sheet hands the real PNG to X's own app/site, which
 * uploads it as a normal photo attachment.
 *
 * The image is pre-fetched into a File as soon as the card is ready (not
 * inside the click handler) because Safari/iOS require navigator.share() to
 * run synchronously off the user gesture — an await beforehand can drop the
 * activation and make it silently reject.
 */
export default function ShareToXButton({
  card,
  imageUrl,
  shareUrl,
  className,
}: {
  card: TweetCardFacts;
  imageUrl: string;
  shareUrl: string;
  className?: string;
}) {
  const [shareFile, setShareFile] = useState<File | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return;
        setShareFile(new File([blob], `hh-goa-2026-${card.builderCode}.png`, { type: "image/png" }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [imageUrl, card.builderCode]);

  const tweetText = buildTweetText(card);
  const tweetUrl = buildTweetUrl(tweetText, shareUrl);

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!shareFile || !navigator.canShare?.({ files: [shareFile] })) return;
    e.preventDefault();
    try {
      await navigator.share({ files: [shareFile], text: `${tweetText}\n\n${shareUrl}` });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      window.open(tweetUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <LinkButton
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      tone="pink"
      size="lg"
      className={className}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M18.2 2H21l-6.5 7.4L21.7 22H15l-4.6-6.3L4.9 22H2l7-8L2 2h6.8l4.3 5.9zM17 20.2h1.6L6.9 3.7H5.2z" />
      </svg>
      Share To X
    </LinkButton>
  );
}
