import path from "node:path";
import { createCanvas, loadImage, type Image, type SKRSContext2D } from "@napi-rs/canvas";
import QRCode from "qrcode";
import { getFlavor } from "./flavor";
import { registerCardFonts } from "./fonts";
import { generateBuilderCode } from "./id";
import { CARD_H, CARD_W, COLORS, FONT_FAMILY, TEMPLATE_FIELDS } from "./theme";
import { fitText, roundRectPath } from "./utils";

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

const TEMPLATE_PATH = path.join(process.cwd(), "public", "frame-generator", "pass-template.png");

// The template PNG never changes between requests, so it's decoded once and
// kept in memory rather than re-read from disk and re-decoded on every card.
let templateCache: Promise<Image> | null = null;
function loadTemplate(): Promise<Image> {
  if (!templateCache) templateCache = loadImage(TEMPLATE_PATH);
  return templateCache;
}

export async function generateCard(input: GenerateCardInput): Promise<GenerateCardResult> {
  registerCardFonts();

  const [photo, template] = await Promise.all([loadImage(input.photo), loadTemplate()]);
  const flavor = getFlavor(input.stackRole);
  const builderCode = generateBuilderCode();
  const handleUrl = formatHandleUrl(input.socialUrl, input.shareUrl);

  const canvas = createCanvas(CARD_W, CARD_H);
  const ctx = canvas.getContext("2d");

  // Background intentionally left transparent — the template PNG's own
  // alpha is preserved straight through to the output file.
  ctx.drawImage(template, 0, 0, CARD_W, CARD_H);

  drawRotatedField(ctx, TEMPLATE_FIELDS.photo, (local) => {
    drawPhotoCoverFit(ctx, photo, local);
  });

  drawRotatedField(ctx, TEMPLATE_FIELDS.nameBlock, (local) => {
    drawNameBlock(ctx, local, input.name.trim(), flavor.badgeTitle, handleUrl);
  });

  drawRotatedField(ctx, TEMPLATE_FIELDS.builderClassChip, (local) => {
    drawChipValue(ctx, local, flavor.builderClass);
  });

  drawRotatedField(ctx, TEMPLATE_FIELDS.shippingChip, (local) => {
    drawChipValue(ctx, local, flavor.tagline);
  });

  await drawRotatedFieldAsync(ctx, TEMPLATE_FIELDS.qr, async (local) => {
    await drawQr(ctx, local, handleUrl);
  });

  drawRotatedField(ctx, TEMPLATE_FIELDS.barcode, (local) => {
    drawBarcode(ctx, local, builderCode, flavor.badgeTitle);
  });

  drawRotatedField(ctx, TEMPLATE_FIELDS.serial, (local) => {
    drawSerial(ctx, local, builderCode);
  });

  const png = await canvas.encode("png");

  return {
    png: Buffer.from(png),
    builderCode,
    builderClass: flavor.builderClass,
    tagline: flavor.tagline,
    badgeTitle: flavor.badgeTitle,
  };
}

type FieldSpec = { cx: number; cy: number; w: number; h: number; deg: number };
type LocalRect = { x: number; y: number; w: number; h: number };

/** Rotates the canvas around a field's own measured center by its own
 * measured tilt, hands the callback a LOCAL axis-aligned rect (-w/2..w/2,
 * -h/2..h/2 relative to that center) to draw into, then restores. Each
 * field uses its own independently-measured angle rather than one global
 * transform, since the source art's tilt is very mild and not perfectly
 * uniform across elements. */
function drawRotatedField(ctx: SKRSContext2D, field: FieldSpec, draw: (local: LocalRect) => void) {
  ctx.save();
  ctx.translate(field.cx, field.cy);
  ctx.rotate((field.deg * Math.PI) / 180);
  draw({ x: -field.w / 2, y: -field.h / 2, w: field.w, h: field.h });
  ctx.restore();
}

async function drawRotatedFieldAsync(
  ctx: SKRSContext2D,
  field: FieldSpec,
  draw: (local: LocalRect) => Promise<void>,
) {
  ctx.save();
  ctx.translate(field.cx, field.cy);
  ctx.rotate((field.deg * Math.PI) / 180);
  await draw({ x: -field.w / 2, y: -field.h / 2, w: field.w, h: field.h });
  ctx.restore();
}

function drawPhotoCoverFit(ctx: SKRSContext2D, photo: Image, local: LocalRect) {
  const radius = 14;
  ctx.save();
  roundRectPath(ctx, local.x, local.y, local.w, local.h, radius);
  ctx.clip();

  const imgW = photo.width;
  const imgH = photo.height;
  const scale = Math.max(local.w / imgW, local.h / imgH);
  const sw = local.w / scale;
  const sh = local.h / scale;
  const sx = (imgW - sw) / 2;
  const sy = (imgH - sh) / 2;
  ctx.drawImage(photo, sx, sy, sw, sh, local.x, local.y, local.w, local.h);
  ctx.restore();
}

function drawNameBlock(
  ctx: SKRSContext2D,
  local: LocalRect,
  name: string,
  badgeTitle: string,
  handleUrl: string,
) {
  const centerX = local.x + local.w / 2;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const upperName = name.toUpperCase();
  const nameSize = fitText(ctx, upperName, local.w, FONT_FAMILY.display, 82, 40);
  ctx.font = `${nameSize}px ${FONT_FAMILY.display}`;
  ctx.fillStyle = COLORS.ink;
  const nameY = local.y + 80;
  ctx.fillText(upperName, centerX, nameY);

  // Archivo Black rather than the body family: it's the one face confirmed
  // to register reliably, so this renders genuinely heavy instead of
  // silently falling back to a regular-weight system font that ignores the
  // requested numeric weight.
  const roleSize = fitText(ctx, badgeTitle, local.w - 40, FONT_FAMILY.display, 38, 22);
  ctx.font = `${roleSize}px ${FONT_FAMILY.display}`;
  ctx.fillStyle = COLORS.pink;
  ctx.fillText(badgeTitle, centerX, nameY + 52);

  // Handle also switched to Archivo Black (smaller size) for the same
  // reason — the body font's bold weight isn't resolving, so a "500 body"
  // request was rendering as thin fallback text.
  ctx.font = `24px ${FONT_FAMILY.display}`;
  ctx.fillStyle = "rgba(11,51,37,.7)";
  ctx.fillText(handleUrl, centerX, nameY + 96);

  ctx.restore();
}

function drawChipValue(ctx: SKRSContext2D, local: LocalRect, value: string) {
  // The label ("BUILDER CLASS:" / "CURRENTLY SHIPPING:") is baked into the
  // template at the top of the chip; the value goes in the remaining space
  // below it. Sized to at least match the baked label's own cap height
  // (measured ~35px) so the value never reads smaller than its label.
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const centerX = local.x + local.w / 2;
  const valueY = local.y + local.h - 32;
  const size = fitText(ctx, value, local.w - 36, FONT_FAMILY.display, 36, 18);
  ctx.font = `${size}px ${FONT_FAMILY.display}`;
  ctx.fillStyle = COLORS.ink;
  ctx.fillText(value, centerX, valueY);
  ctx.restore();
}

async function drawQr(ctx: SKRSContext2D, local: LocalRect, handleUrl: string) {
  const size = Math.min(local.w, local.h);
  const buffer = await QRCode.toBuffer(handleUrl.startsWith("http") ? handleUrl : `https://${handleUrl}`, {
    type: "png",
    margin: 0,
    width: Math.round(size),
    color: { dark: "#0b3325ff", light: "#f3e7ceff" },
  });
  const img = await loadImage(buffer);
  const x = local.x + (local.w - size) / 2;
  const y = local.y + (local.h - size) / 2;
  ctx.drawImage(img, x, y, size, size);
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function drawBarcode(ctx: SKRSContext2D, local: LocalRect, builderId: string, stack: string) {
  const seed = hashString(builderId + stack);
  const bars: Array<{ w: number; o: number }> = [];
  for (let i = 0; i < 26; i++) {
    const v = Math.abs((seed >> (i % 24)) ^ (i * 2654435761));
    bars.push({ w: (0.45 + (v % 3) * 0.5) * 6, o: v % 5 === 0 ? 0.6 : 1 });
  }
  const totalW = bars.reduce((a, b) => a + b.w, 0) + 3 * (bars.length - 1);
  const scale = local.w / totalW;

  ctx.save();
  let bx = local.x;
  for (const bar of bars) {
    const w = bar.w * scale;
    ctx.fillStyle = COLORS.ink;
    ctx.globalAlpha = bar.o;
    ctx.fillRect(bx, local.y, w, local.h);
    bx += w + 3 * scale;
  }
  ctx.restore();
}

function drawSerial(ctx: SKRSContext2D, local: LocalRect, builderCode: string) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const size = fitText(ctx, builderCode, local.w - 12, FONT_FAMILY.display, 34, 20);
  ctx.font = `${size}px ${FONT_FAMILY.display}`;
  ctx.fillStyle = COLORS.ink;
  ctx.fillText(builderCode, local.x + local.w / 2, local.y + local.h / 2 + 12);
  ctx.restore();
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