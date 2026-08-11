import { createCanvas, loadImage } from "@napi-rs/canvas";
import { getFlavor } from "./flavor";
import { registerCardFonts } from "./fonts";
import { generateBuilderCode } from "./id";
import { drawBeachBagRow, drawClosingRule, drawFooter, drawHashtag } from "./layers/footer";
import { CONTENT_PAD, drawFrame } from "./layers/frame";
import { drawSubline, drawWordmark } from "./layers/header";
import { drawLabelValue, drawName, drawSocialLink } from "./layers/linkAndBadge";
import { drawPhotoFrame } from "./layers/photo";
import { CARD_H, CARD_W, COLORS } from "./theme";
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

const CX = CARD_W / 2;

export async function generateCard(input: GenerateCardInput): Promise<GenerateCardResult> {
  registerCardFonts();

  const photo = await loadImage(input.photo);
  const flavor = getFlavor(input.stackRole);
  const builderCode = generateBuilderCode();

  const canvas = createCanvas(CARD_W, CARD_H);
  const ctx = canvas.getContext("2d");

  drawFrame(ctx);

  const contentX = CONTENT_PAD;
  const contentW = CARD_W - CONTENT_PAD * 2;

  drawWordmark(ctx, CONTENT_PAD + 66);
  drawSubline(ctx, CONTENT_PAD + 112);

  let cursorY = CONTENT_PAD + 150;
  drawRule(ctx, CX - 60, cursorY, 120, COLORS.goldDim);
  cursorY += 46;

  const photoW = 520;
  const photoH = 560;
  drawPhotoFrame(ctx, photo, { x: CX - photoW / 2, y: cursorY, w: photoW, h: photoH });
  cursorY += photoH + 64;

  cursorY = drawName(ctx, CX, cursorY, input.name.trim(), contentW - 40) + 60;
  cursorY = drawLabelValue(ctx, CX, cursorY, "Stack / Role", flavor.badgeTitle, {
    valueColor: COLORS.gold,
    maxWidth: contentW - 40,
  }) + 46;
  cursorY = drawLabelValue(ctx, CX, cursorY, "Builder Class", flavor.builderClass, {
    maxWidth: contentW - 40,
  }) + 46;
  cursorY = drawLabelValue(ctx, CX, cursorY, "Currently Shipping", flavor.tagline, {
    maxWidth: contentW - 40,
  }) + 20;

  const url = formatSocialUrl(input.socialUrl);
  if (url) {
    drawSocialLink(ctx, CX, cursorY + 36, url, contentW - 40);
  }

  // The footer block is bottom-anchored at fixed offsets rather than
  // continuing the flowing cursor, so its position never depends on
  // whether the optional social-link row was drawn above it.
  const hashtagY = CARD_H - CONTENT_PAD - 14;
  const closingRuleY = hashtagY - 40;
  const footerTop = closingRuleY - 40 - 156;
  const beachBagY = footerTop - 40;
  const rule2Y = beachBagY - 40;

  drawRule(ctx, CX - 60, rule2Y, 120, COLORS.goldDim);
  drawBeachBagRow(ctx, CX, beachBagY);

  await drawFooter(ctx, {
    top: footerTop,
    left: contentX,
    right: contentX + contentW,
    builderCode,
    shareUrl: input.shareUrl,
  });

  drawClosingRule(ctx, contentX, closingRuleY, contentW);
  drawHashtag(ctx, CX, hashtagY);

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
