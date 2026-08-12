import { createCanvas, loadImage } from "@napi-rs/canvas";
import { getFlavor } from "./flavor";
import { registerCardFonts } from "./fonts";
import { generateBuilderCode } from "./id";
import { drawGroundPalms, drawGroundStrip } from "./layers/decor";
import { clipFrame, CONTENT_PAD, drawFrame, HEADER_H } from "./layers/frame";
import { drawBottomBar, drawVerifyRow, QR_SIZE } from "./layers/footer";
import { drawHeader } from "./layers/header";
import { drawBuilderJourney, drawIdentityGrid, drawName, drawStackLine, drawTicketStub } from "./layers/identity";
import { CARD_H, CARD_W } from "./theme";
import { drawRule } from "./utils";

export type GenerateCardInput = {
  photo: Buffer;
  name: string;
  stackRole: string;
  /** The builder's own X/social profile URL, shown only when provided. */
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

const BODY_BOTTOM_PAD = 125;

export async function generateCard(input: GenerateCardInput): Promise<GenerateCardResult> {
  registerCardFonts();

  const photo = await loadImage(input.photo);
  const flavor = getFlavor(input.stackRole);
  const builderCode = generateBuilderCode();

  const canvas = createCanvas(CARD_W, CARD_H);
  const ctx = canvas.getContext("2d");

  drawFrame(ctx);
  ctx.save();
  clipFrame(ctx);

  drawHeader(ctx, photo, builderCode);

  const contentX = CONTENT_PAD;
  const contentRight = CARD_W - CONTENT_PAD;
  const contentW = contentRight - contentX;
  const bodyTop = HEADER_H + 34;

  drawGroundStrip(ctx, HEADER_H);
  drawGroundPalms(ctx, HEADER_H);
  drawTicketStub(ctx, bodyTop, builderCode);

  let cursorY = bodyTop + 80;
  cursorY = drawName(ctx, contentX, cursorY, input.name.trim(), contentW);
  cursorY = drawStackLine(ctx, contentX, cursorY + 42, flavor.badgeTitle);

  const ruleY = cursorY + 42;
  drawRule(ctx, contentX, ruleY, contentW, "rgba(11,51,37,.28)", 2);

  const gridBottom = drawIdentityGrid(ctx, contentX, ruleY + 41, contentW, flavor.builderClass, flavor.tagline);

  drawBuilderJourney(ctx, contentX, gridBottom + 120, contentW);

  const verifyTop = CARD_H - BODY_BOTTOM_PAD - QR_SIZE;
  const handleUrl = formatHandleUrl(input.socialUrl, input.shareUrl);
  await drawVerifyRow(ctx, {
    x: contentX,
    y: verifyTop,
    right: contentRight,
    builderId: builderCode,
    stack: flavor.badgeTitle,
    handleUrl,
  });

  ctx.restore(); // end clipFrame

  drawBottomBar(ctx);

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
 * "x.com/handle" when a real handle/URL was given, otherwise the card's own
 * share-page host — never a fabricated placeholder.
 */
function formatHandleUrl(raw: string, shareUrl: string): string {
  const trimmed = (raw || "").trim().replace(/\s+/g, "");
  if (trimmed) {
    const bareHandle = trimmed.replace(/^@/, "");
    if (/^[a-zA-Z0-9_]{1,30}$/.test(bareHandle)) {
      return `x.com/${bareHandle}`;
    }
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      const host = new URL(withProtocol).hostname;
      if (host.includes(".")) {
        return withProtocol.replace(/^https?:\/\//i, "").replace(/\/$/, "");
      }
    } catch {
      // falls through to shareUrl below
    }
  }
  return shareUrl.replace(/^https?:\/\//i, "");
}