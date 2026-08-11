import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TerminalLinkButton } from "@/components/TerminalButton";
import TerminalTitleBar from "@/components/TerminalTitleBar";
import { getCard } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) return { title: "Card not found · HH Goa 2026" };

  const title = `${card.metadata.name}'s HH Goa 2026 Builder Pass`;
  const description = `${card.metadata.badgeTitle} · ${card.metadata.builderClass} · ${card.metadata.tagline}. Build your own at the HH Goa 2026 Frame Generator.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: card.imageUrl, width: 1300, height: 1630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card.imageUrl],
    },
  };
}

export default async function SharePage({ params }: Params) {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) notFound();

  const tweetText = `I just built my Hacker House Goa 2026 builder pass — ${card.metadata.badgeTitle}. See you 28–31 Oct #FrameInGoa`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  return (
    <main className="scanlines relative flex min-h-full w-full flex-1 flex-col bg-bg">
      <TerminalTitleBar
        filename={`${id}.png`}
        status="SHARED"
        action={
          <Link href="/" className="text-sm text-text-dim hover:text-amber">
            cd ~
          </Link>
        }
      />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center gap-6 px-6 py-8 text-center">
        <h1 className="text-xl font-bold text-text-bright">$ whoami &mdash; {card.metadata.name}</h1>

        {/* eslint-disable-next-line @next/next/no-img-element -- remote Blob-hosted PNG, not a Next-optimizable local asset */}
        <img
          src={card.imageUrl}
          alt={`${card.metadata.name}'s Hacker House Goa 2026 builder pass`}
          className="w-full max-w-sm border border-hairline"
        />

        <div className="flex w-full max-w-sm flex-col gap-3">
          <TerminalLinkButton href={tweetUrl} target="_blank" rel="noopener noreferrer">
            share_to_x
          </TerminalLinkButton>
          <TerminalLinkButton href={`/api/download/${id}`} download variant="secondary">
            download.png
          </TerminalLinkButton>
          <Link href="/" className="text-sm text-text-dim hover:text-amber">
            ./build-your-own.sh
          </Link>
        </div>
      </div>
    </main>
  );
}
