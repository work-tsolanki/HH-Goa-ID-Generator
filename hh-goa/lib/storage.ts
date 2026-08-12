import { list, put } from "@vercel/blob";
import { cache } from "react";

export type CardMetadata = {
  id: string;
  name: string;
  badgeTitle: string;
  builderClass: string;
  tagline: string;
  builderCode: string;
  socialUrl: string;
  createdAt: string;
};

export async function saveCard(
  id: string,
  png: Buffer,
  ogImage: Buffer,
  metadata: CardMetadata,
) {
  const [imageBlob, ogImageBlob, metaBlob] = await Promise.all([
    put(`cards/${id}.png`, png, { access: "public", contentType: "image/png" }),
    // A much smaller WebP re-encode of the same card, used only for the
    // og:image/twitter:image tags — X has to fetch and process that image
    // itself before the compose-box preview appears, so trimming it down
    // from a multi-MB PNG measurably speeds up how fast the card attaches.
    put(`cards/${id}-og.webp`, ogImage, { access: "public", contentType: "image/webp" }),
    put(`cards/${id}.json`, JSON.stringify(metadata), {
      access: "public",
      contentType: "application/json",
    }),
  ]);
  return { imageUrl: imageBlob.url, ogImageUrl: ogImageBlob.url, metadataUrl: metaBlob.url };
}

// cache() dedupes this within a single request — the share page calls
// getCard once from generateMetadata and again from the page body, and
// without this both would independently pay for the Blob list + fetch.
export const getCard = cache(async function getCard(
  id: string,
): Promise<{ imageUrl: string; ogImageUrl: string; metadata: CardMetadata } | null> {
  if (!/^[a-z0-9]+$/i.test(id)) return null;

  const { blobs } = await list({ prefix: `cards/${id}` });
  const imageBlob = blobs.find((b) => b.pathname.endsWith(".png"));
  const ogImageBlob = blobs.find((b) => b.pathname.endsWith(".webp"));
  const metaBlob = blobs.find((b) => b.pathname.endsWith(".json"));
  if (!imageBlob || !metaBlob) return null;

  const metaRes = await fetch(metaBlob.url, { cache: "no-store" });
  if (!metaRes.ok) return null;
  const metadata = (await metaRes.json()) as CardMetadata;

  // Older cards saved before the -og.webp variant existed fall back to the
  // full PNG so their share links keep working.
  return { imageUrl: imageBlob.url, ogImageUrl: ogImageBlob?.url ?? imageBlob.url, metadata };
});
