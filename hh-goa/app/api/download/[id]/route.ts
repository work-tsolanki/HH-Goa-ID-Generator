import { NextRequest, NextResponse } from "next/server";
import { getCard } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  const imageRes = await fetch(card.imageUrl, { cache: "no-store" });
  if (!imageRes.ok || !imageRes.body) {
    return NextResponse.json({ error: "Card image unavailable." }, { status: 502 });
  }

  return new NextResponse(imageRes.body, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="hh-goa-2026-${id}.png"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
