import { NextRequest, NextResponse } from "next/server";
import { generateCardId } from "@/lib/card/id";
import { generateCard } from "@/lib/card/render";
import { saveCard } from "@/lib/storage";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
const MAX_FIELD_LEN = 60;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const photoFile = form.get("photo");
    const name = String(form.get("name") ?? "").trim().slice(0, MAX_FIELD_LEN);
    const stackRole = String(form.get("stackRole") ?? "").trim().slice(0, MAX_FIELD_LEN);
    const socialUrl = String(form.get("socialUrl") ?? "").trim().slice(0, 120);

    if (!(photoFile instanceof File)) {
      return NextResponse.json({ error: "A photo is required." }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Your name is required." }, { status: 400 });
    }
    if (!stackRole) {
      return NextResponse.json({ error: "Your stack or role is required." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(photoFile.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Please upload a JPG, PNG, or WEBP photo." },
        { status: 400 },
      );
    }
    if (photoFile.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "Photo is too large (max 15MB)." }, { status: 400 });
    }

    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const id = generateCardId();
    const shareUrl = new URL(`/share/${id}`, req.nextUrl.origin).toString();

    const result = await generateCard({
      photo: photoBuffer,
      name,
      stackRole,
      socialUrl,
      shareUrl,
    });

    const { imageUrl } = await saveCard(id, result.png, result.ogImage, {
      id,
      name,
      badgeTitle: result.badgeTitle,
      builderClass: result.builderClass,
      tagline: result.tagline,
      builderCode: result.builderCode,
      socialUrl,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id,
      imageUrl,
      shareUrl,
      downloadUrl: `/api/download/${id}`,
      name,
      badgeTitle: result.badgeTitle,
      builderClass: result.builderClass,
      tagline: result.tagline,
      builderCode: result.builderCode,
    });
  } catch (err) {
    console.error("[api/generate] failed:", err);
    return NextResponse.json(
      { error: "Something went wrong generating your card. Please try again." },
      { status: 500 },
    );
  }
}
