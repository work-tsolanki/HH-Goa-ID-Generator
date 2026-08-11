import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/Button";
import Logo from "@/components/Logo";
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
    <main className="flex min-h-full w-full flex-1 flex-col bg-green">
      <nav className="flex items-center justify-between px-6 py-6 sm:px-12">
        <Logo />
        <Link href="/" className="text-sm font-medium text-text-dim hover:text-gold">
          Build your own
        </Link>
      </nav>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-7 px-6 py-6 text-center">
        <h1 className="font-display text-2xl text-gold">{card.metadata.name}&rsquo;s builder pass</h1>

        {/* eslint-disable-next-line @next/next/no-img-element -- remote Blob-hosted PNG, not a Next-optimizable local asset */}
        <img
          src={card.imageUrl}
          alt={`${card.metadata.name}'s Hacker House Goa 2026 builder pass`}
          className="w-full max-w-sm rounded"
        />

        <div className="flex w-full max-w-sm flex-col gap-3">
          <LinkButton href={tweetUrl} target="_blank" rel="noopener noreferrer">
            Share to X
          </LinkButton>
          <LinkButton href={`/api/download/${id}`} download variant="secondary">
            Download PNG
          </LinkButton>
          <Link href="/" className="text-sm text-text-dim hover:text-gold">
            Build your own card
          </Link>
        </div>
      </div>
    </main>
  );
}
