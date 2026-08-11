import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostcardLogo from "@/components/PostcardLogo";
import { getCard } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) return { title: "Card not found · HH Goa 2026" };

  const title = `${card.metadata.name}'s HH Goa 2026 Builder Card`;
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

  const tweetText = `I just built my Hacker House Goa 2026 badge — ${card.metadata.badgeTitle}. See you 28–31 Oct 🌴 #FrameInGoa`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  return (
    <main className="relative flex min-h-full w-full flex-1 flex-col bg-cream">
      <div className="dot-field pointer-events-none absolute inset-0" aria-hidden />

      <header className="sticky top-0 z-20 flex items-center justify-between border-b-4 border-gold bg-green px-5 py-4 sm:px-8">
        <PostcardLogo dark />
        <Link href="/" className="text-sm font-bold text-gold">
          Build your own →
        </Link>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center gap-6 px-6 py-8 text-center">
        <h1 className="font-display text-2xl font-bold text-green">
          {card.metadata.name}&rsquo;s builder pass
        </h1>

        {/* eslint-disable-next-line @next/next/no-img-element -- remote Blob-hosted PNG, not a Next-optimizable local asset */}
        <img
          src={card.imageUrl}
          alt={`${card.metadata.name}'s Hacker House Goa 2026 card`}
          className="w-full max-w-sm rounded-2xl border-2 border-green/10 shadow-xl"
        />

        <div className="flex w-full max-w-sm flex-col gap-3">
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-pink px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink/30"
          >
            Share to X
          </a>
          <a
            href={`/api/download/${id}`}
            download
            className="rounded-full border-2 border-green px-8 py-3.5 text-base font-bold text-green"
          >
            Download PNG
          </a>
          <Link href="/" className="text-sm font-semibold text-green/60">
            Build your own card
          </Link>
        </div>
      </div>
    </main>
  );
}
