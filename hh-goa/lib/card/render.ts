import { createCanvas, loadImage } from "@napi-rs/canvas";
import { generateBuilderCode } from "./id";
import { drawTopDecorations, drawMidDecorations } from "./layers/decorations";
import { drawBottomRibbon, drawFooter } from "./layers/footer";
import { CONTENT_PAD, drawFrame } from "./layers/frame";
import {
  drawGoaBadge,
  drawHeadline,
  drawPostageStamp,
  drawTopRibbon,
  drawVerticalMargins,
} from "./layers/header";
import { drawTitleBadge, drawLinkBar, drawNamePill } from "./layers/linkAndBadge";
import { drawPhotoFrame, drawStickyNote } from "./layers/photo";
import { drawBeachScene, drawSignpost } from "./layers/scene";
import { CARD_H, CARD_W } from "./theme";
import { getFlavor } from "./flavor";
import { registerCardFonts } from "./fonts";

export type GenerateCardInput = {
  photo: Buffer;
  name: string;
  stackRole: string;
  /** The builder's own X/social profile URL, shown on the link bar. */
  socialUrl: string;
  /** This card's own share-page URL, encoded into the QR code. */
  shareUrl: string;
};

export type GenerateCardResult = {
  png: Buffer;
  builderCode: string;
  builderClass: string;
  tagline: string;
  badgeTitle: string;
};

const CX = CARD_W / 2;

export async function generateCard(input: GenerateCardInput): Promise<GenerateCardResult> {
  registerCardFonts();

  const photo = await loadImage(input.photo);
  const flavor = getFlavor(input.stackRole);
  const builderCode = generateBuilderCode();

  const canvas = createCanvas(CARD_W, CARD_H);
  const ctx = canvas.getContext("2d");

  drawFrame(ctx);
  drawTopDecorations(ctx);

  drawTopRibbon(ctx);
  drawPostageStamp(ctx, CONTENT_PAD - 8, 44);
  drawGoaBadge(ctx, CARD_W - CONTENT_PAD - 88, 148, 92);

  drawHeadline(ctx, 300);

  drawVerticalMargins(ctx, CARD_H, CONTENT_PAD + 30, CARD_W - CONTENT_PAD - 20);

  const photoLayout = { cx: CX, cy: 665, outerRadius: 250, innerRadius: 214 };
  drawMidDecorations(ctx, photoLayout.cy - photoLayout.outerRadius, photoLayout.cy + photoLayout.outerRadius);

  drawSignpost(ctx, 226, 545);
  drawBeachScene(ctx, 872, 500, 268, 340);

  drawPhotoFrame(ctx, photo, photoLayout);
  drawStickyNote(ctx, 742, 348);

  let cursorY = photoLayout.cy + photoLayout.outerRadius + 66;

  const namePillH = 62;
  drawNamePill(ctx, CX, cursorY, 760, namePillH, input.name);
  cursorY += namePillH + 22;

  const url = formatUrl(input.socialUrl);
  if (url) {
    const linkBarH = 46;
    drawLinkBar(ctx, CX, cursorY, 640, linkBarH, url);
    cursorY += linkBarH + 22;
  }

  const badgeY = cursorY;
  drawTitleBadge(ctx, CX, badgeY, 62, flavor.badgeTitle);

  const footerTop = badgeY + 62 + 58;
  const footerBottom = CARD_H - CONTENT_PAD - 96;
  await drawFooter(ctx, {
    top: footerTop,
    bottom: footerBottom,
    left: CONTENT_PAD + 10,
    right: CARD_W - CONTENT_PAD - 10,
    builderClass: flavor.builderClass,
    tagline: flavor.tagline,
    builderCode,
    name: input.name,
    shareUrl: input.shareUrl,
  });

  drawBottomRibbon(ctx, CARD_H - CONTENT_PAD - 34, "#FRAMEINGOA");

  const png = await canvas.encode("png");

  return {
    png: Buffer.from(png),
    builderCode,
    builderClass: flavor.builderClass,
    tagline: flavor.tagline,
    badgeTitle: flavor.badgeTitle,
  };
}

/**
 * Returns "" when no real link was provided — never fabricates a placeholder
 * onto the card, and never bakes in obvious garbage (e.g. "not a url").
 */
function formatUrl(raw: string): string {
  const trimmed = (raw || "").trim().replace(/\s+/g, "");
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let host: string;
  try {
    host = new URL(withProtocol).hostname;
  } catch {
    return "";
  }
  if (!host.includes(".")) return "";

  return withProtocol.replace(/\/$/, "").toUpperCase();
}
