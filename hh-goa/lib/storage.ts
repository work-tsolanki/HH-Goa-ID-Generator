import { list, put } from "@vercel/blob";

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

export async function saveCard(id: string, png: Buffer, metadata: CardMetadata) {
  const [imageBlob, metaBlob] = await Promise.all([
    put(`cards/${id}.png`, png, { access: "public", contentType: "image/png" }),
    put(`cards/${id}.json`, JSON.stringify(metadata), {
      access: "public",
      contentType: "application/json",
    }),
  ]);
  return { imageUrl: imageBlob.url, metadataUrl: metaBlob.url };
}

export async function getCard(
  id: string,
): Promise<{ imageUrl: string; metadata: CardMetadata } | null> {
  if (!/^[a-z0-9]+$/i.test(id)) return null;

  const { blobs } = await list({ prefix: `cards/${id}` });
  const imageBlob = blobs.find((b) => b.pathname.endsWith(".png"));
  const metaBlob = blobs.find((b) => b.pathname.endsWith(".json"));
  if (!imageBlob || !metaBlob) return null;

  const metaRes = await fetch(metaBlob.url, { cache: "no-store" });
  if (!metaRes.ok) return null;
  const metadata = (await metaRes.json()) as CardMetadata;

  return { imageUrl: imageBlob.url, metadata };
}
