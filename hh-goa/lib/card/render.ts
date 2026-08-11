import { createCanvas, loadImage } from "@napi-rs/canvas";
import { getFlavor } from "./flavor";
import { registerCardFonts } from "./fonts";
import { generateBuilderCode } from "./id";
import { drawClosingPrompt, drawDivider, drawFooter } from "./layers/footer";
import { CONTENT_PAD, drawFrame } from "./layers/frame";
import { drawBootLines, drawTitleBar, drawWordmark, TITLE_BAR_H } from "./layers/header";
import { drawPromptRow } from "./layers/linkAndBadge";
import { drawPhotoFrame } from "./layers/photo";
import { CARD_H, CARD_W, COLORS } from "./theme";

export type GenerateCardInput = {
  photo: Buffer;
  name: string;
  stackRole: string;
  /** The builder's own X/social profile URL, shown as an optional prompt row. */
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
  drawTitleBar(ctx);

  const contentX = CONTENT_PAD;
  const contentW = CARD_W - CONTENT_PAD * 2;

  let cursorY = drawBootLines(ctx, contentX, TITLE_BAR_H + 56);
  cursorY += 26;
  drawDivider(ctx, contentX, cursorY, contentW);

  drawWordmark(ctx, cursorY + 68);
  cursorY += 68 + 46;

  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.textDim;
  ctx.font = "16px \"IBM Plex Mono\"";
  ctx.fillText("GOA, IN · 28–31 OCT 2026", CX, cursorY);
  ctx.restore();
  cursorY += 40;

  const photoSize = 480;
  const photoLayout = { x: CX - photoSize / 2, y: cursorY, size: photoSize };
  drawPhotoFrame(ctx, photo, photoLayout);
  cursorY = photoLayout.y + photoSize + 56;

  const fieldMaxWidth = contentW;
  cursorY = drawPromptRow(ctx, contentX, cursorY, {
    prompt: "whoami",
    response: input.name.trim().toUpperCase(),
    maxWidth: fieldMaxWidth,
  });
  cursorY += 30;

  cursorY = drawPromptRow(ctx, contentX, cursorY, {
    prompt: "role --get",
    response: flavor.badgeTitle,
    responseColor: COLORS.amber,
    maxWidth: fieldMaxWidth,
    responseSize: 28,
  });
  cursorY += 30;

  cursorY = drawPromptRow(ctx, contentX, cursorY, {
    prompt: "class.assign",
    response: flavor.builderClass,
    responseColor: COLORS.green,
    maxWidth: fieldMaxWidth,
    responseSize: 28,
  });
  cursorY += 30;

  cursorY = drawPromptRow(ctx, contentX, cursorY, {
    prompt: "status.log",
    response: flavor.tagline,
    maxWidth: fieldMaxWidth,
    responseSize: 26,
  });
  cursorY += 30;

  const url = formatSocialUrl(input.socialUrl);
  if (url) {
    cursorY = drawPromptRow(ctx, contentX, cursorY, {
      prompt: "social.link",
      response: url,
      maxWidth: fieldMaxWidth,
      promptSize: 18,
      responseSize: 22,
    });
    cursorY += 26;
  }

  cursorY += 10;
  drawDivider(ctx, contentX, cursorY, contentW);
  cursorY += 40;

  const footerBottom = CARD_H - CONTENT_PAD - 70;
  await drawFooter(ctx, {
    top: cursorY,
    bottom: footerBottom,
    left: contentX,
    right: contentX + contentW,
    builderCode,
    shareUrl: input.shareUrl,
  });

  drawClosingPrompt(ctx, contentX, CARD_H - CONTENT_PAD - 20, contentX + contentW);

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
function formatSocialUrl(raw: string): string {
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

  return withProtocol.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
