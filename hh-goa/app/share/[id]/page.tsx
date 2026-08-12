import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/Button";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import ShareToXButton from "@/components/ShareToXButton";
import { OG_IMAGE_H, OG_IMAGE_W } from "@/lib/card/theme";
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
      // The much smaller WebP variant, not the full-size download PNG — X
      // has to fetch and process whatever this points at before the
      // compose-box preview shows up, so a lighter file attaches faster.
      images: [{ url: card.ogImageUrl, width: OG_IMAGE_W, height: OG_IMAGE_H }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card.ogImageUrl],
    },
  };
}

export default async function SharePage({ params }: Params) {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) notFound();

  const h = await headers();
  const host = h.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const shareUrl = `${protocol}://${host}/share/${id}`;

  return (
    <div className="relative z-10 flex min-h-dvh w-full flex-1 flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3.5 border-b-[3px] border-ink bg-paper px-4 py-3.5 sm:px-10">
        <Link href="/" className="neu neu-btn flex items-center gap-2.5 bg-forest px-3.5 py-2.5">
          <Logo className="text-paper" />
        </Link>
        <Link href="/" className="neu neu-btn font-display bg-gold px-5 py-3.5 text-[13px] tracking-[0.02em] uppercase">
          Build My Pass
        </Link>
      </header>

      <main className="animate-pop-in relative z-1 mx-auto flex w-full max-w-[460px] flex-1 flex-col items-center gap-7 px-4 py-8 text-center sm:px-10">
        <h1 className="font-display text-[26px] text-ink">
          {card.metadata.name}&rsquo;s builder pass
        </h1>

        <div className="neu w-full max-w-sm overflow-hidden bg-[#F8EFDC]" style={{ boxShadow: "10px 10px 0 var(--color-ink)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- remote Blob-hosted PNG, not a Next-optimizable local asset */}
          <img
            src={card.imageUrl}
            alt={`${card.metadata.name}'s Hacker House Goa 2026 builder pass`}
            className="block w-full"
          />
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3.5">
          <ShareToXButton card={card.metadata} shareUrl={shareUrl} className="neu-lg" />
          <LinkButton href={`/api/download/${id}`} download tone="gold" size="lg" className="neu-lg">
            Download PNG
          </LinkButton>
          <Link href="/" className="font-body text-[13px] font-semibold tracking-[0.02em] text-ink hover:text-pink">
            Build your own card
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
