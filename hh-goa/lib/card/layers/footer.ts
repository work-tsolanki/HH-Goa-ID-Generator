import { loadImage, type SKRSContext2D } from "@napi-rs/canvas";
import QRCode from "qrcode";
import { CARD_H, CARD_W, COLORS, FONT_FAMILY } from "../theme";

const BOTTOM_BAR_H = 73;
const QR_SIZE = 143;

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** A deterministic decorative bar pattern, seeded from the builder id + stack — not a scannable barcode. */
function buildBars(seed: number): Array<{ w: number; o: number }> {
  const bars: Array<{ w: number; o: number }> = [];
  for (let i = 0; i < 22; i++) {
    const v = Math.abs((seed >> (i % 24)) ^ (i * 2654435761));
    bars.push({ w: (0.45 + (v % 3) * 0.5) * 13, o: v % 5 === 0 ? 0.4 : 1 });
  }
  return bars;
}

export async function drawVerifyRow(
  ctx: SKRSContext2D,
  opts: { x: number; y: number; right: number; builderId: string; stack: string; handleUrl: string },
) {
  const { x, y, right, builderId, stack, handleUrl } = opts;
  const qrSize = QR_SIZE;

  const qrBuffer = await QRCode.toBuffer(handleUrl.startsWith("http") ? handleUrl : `https://${handleUrl}`, {
    type: "png",
    margin: 0,
    width: qrSize - 13,
    color: { dark: "#0b3325ff", light: "#f3e7ceff" },
  });
  const qrImg = await loadImage(qrBuffer);

  ctx.save();
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, qrSize, qrSize);
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(x + 4, y + 4, qrSize - 8, qrSize - 8);
  ctx.drawImage(qrImg, x + 6.5, y + 6.5, qrSize - 13, qrSize - 13);
  ctx.restore();

  const barsX = x + qrSize + 34;
  const barsW = right - barsX;
  const barsH = 49;
  const bars = buildBars(hashString(builderId + stack));
  const totalBarW = bars.reduce((a, b) => a + b.w, 0) + 5.5 * (bars.length - 1);
  const scale = totalBarW > barsW ? barsW / totalBarW : 1;

  const barsTop = y + qrSize - barsH;
  ctx.save();
  let bx = barsX;
  for (const bar of bars) {
    const w = bar.w * scale;
    ctx.fillStyle = COLORS.ink;
    ctx.globalAlpha = bar.o;
    ctx.fillRect(bx, barsTop, w, barsH);
    bx += w + 5.5 * scale;
  }
  ctx.restore();

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 18px ${FONT_FAMILY.body}`;
  ctx.fillStyle = COLORS.ink;
  ctx.fillText("SCAN TO VALIDATE PASS", barsX, barsTop + barsH + 26, barsW);

  ctx.font = `500 17px ${FONT_FAMILY.body}`;
  ctx.fillStyle = "rgba(11,51,37,.55)";
  ctx.fillText(handleUrl, barsX, barsTop + barsH + 48, barsW);
  ctx.restore();
}

export function drawBottomBar(ctx: SKRSContext2D) {
  const top = CARD_H - BOTTOM_BAR_H;
  ctx.save();
  ctx.fillStyle = COLORS.forestMid;
  ctx.fillRect(0, top, CARD_W, BOTTOM_BAR_H);

  const padX = 65;
  const midY = top + BOTTOM_BAR_H / 2 + 1;

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  drawJourneyMark(ctx, padX, midY);

  ctx.font = `700 20px ${FONT_FAMILY.body}`;
  ctx.fillStyle = "rgba(243,231,206,.85)";
  ctx.textAlign = "center";
  ctx.fillText("#FRAMEINGOA", CARD_W / 2, midY);

  ctx.font = `500 17px ${FONT_FAMILY.body}`;
  ctx.fillStyle = "rgba(243,231,206,.55)";
  ctx.textAlign = "right";
  ctx.fillText("LESS NOISE. MORE SIGNAL.", CARD_W - padX, midY);
  ctx.restore();
}

/** "BUILD → COLLAB → SHIP", gold labels joined by pink arrows. */
function drawJourneyMark(ctx: SKRSContext2D, x: number, y: number) {
  const parts = ["BUILD", "→", "COLLAB", "→", "SHIP"];
  ctx.font = `700 20px ${FONT_FAMILY.body}`;
  let cx = x;
  for (const part of parts) {
    ctx.fillStyle = part === "→" ? COLORS.pink : COLORS.gold;
    ctx.fillText(part, cx, y);
    cx += ctx.measureText(part).width + 8;
  }
}

export { BOTTOM_BAR_H, QR_SIZE };
