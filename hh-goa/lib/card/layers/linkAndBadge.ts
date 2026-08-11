import type { SKRSContext2D } from "@napi-rs/canvas";
import { COLORS, FONT_FAMILY } from "../theme";
import { drawSparkle, fitText, roundRectPath } from "../utils";

/** The card's primary identity pill — always shown, since Name is a required field. */
export function drawNamePill(ctx: SKRSContext2D, cx: number, y: number, w: number, h: number, name: string) {
  const x = cx - w / 2;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.14)";
  roundRectPath(ctx, x + 3, y + 5, w, h, h / 2);
  ctx.fill();

  ctx.fillStyle = COLORS.green;
  roundRectPath(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 2;
  roundRectPath(ctx, x, y, w, h, h / 2);
  ctx.stroke();

  const label = name.trim().toUpperCase();
  ctx.fillStyle = COLORS.white;
  const size = fitText(ctx, label, w - 90, FONT_FAMILY.poppinsBold, 28, 15);
  ctx.font = `800 ${size}px ${FONT_FAMILY.poppinsBold}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const textW = ctx.measureText(label).width;
  ctx.fillText(label, cx, y + h / 2 + 1);

  drawSparkle(ctx, cx - textW / 2 - 24, y + h / 2, 8, COLORS.gold, 0.2);
  drawSparkle(ctx, cx + textW / 2 + 24, y + h / 2, 8, COLORS.gold, -0.2);
  ctx.restore();
}

/** Secondary, optional — only rendered when the builder actually provided a link. */
export function drawLinkBar(ctx: SKRSContext2D, cx: number, y: number, w: number, h: number, url: string) {
  const x = cx - w / 2;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  roundRectPath(ctx, x + 3, y + 4, w, h, h / 2);
  ctx.fill();

  ctx.fillStyle = COLORS.greenLine;
  roundRectPath(ctx, x, y, w, h, h / 2);
  ctx.fill();

  ctx.fillStyle = COLORS.white;
  const size = fitText(ctx, url, w - 48, FONT_FAMILY.poppinsSemiBold, 20, 13);
  ctx.font = `600 ${size}px ${FONT_FAMILY.poppinsSemiBold}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(url, cx, y + h / 2 + 1);
  ctx.restore();
}

export function drawTitleBadge(ctx: SKRSContext2D, cx: number, y: number, h: number, label: string) {
  ctx.save();
  ctx.font = `800 26px ${FONT_FAMILY.poppinsBold}`;
  const textW = Math.min(ctx.measureText(label).width, 560);
  const w = Math.max(280, textW + 140);
  const x = cx - w / 2;

  ctx.fillStyle = "rgba(0,0,0,0.12)";
  roundRectPath(ctx, x + 3, y + 4, w, h, h / 2);
  ctx.fill();

  ctx.fillStyle = COLORS.yellow;
  roundRectPath(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.yellowDark;
  ctx.lineWidth = 2;
  roundRectPath(ctx, x, y, w, h, h / 2);
  ctx.stroke();

  drawBolt(ctx, x + 40, y + h / 2, h * 0.5, COLORS.pink);
  drawBolt(ctx, x + w - 40, y + h / 2, h * 0.5, COLORS.pink);

  ctx.fillStyle = COLORS.pinkDark;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const size = fitText(ctx, label, w - 130, FONT_FAMILY.poppinsBold, 26, 16);
  ctx.font = `800 ${size}px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillText(label, cx, y + h / 2 + 1);
  ctx.restore();
}

function drawBolt(ctx: SKRSContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(size * 0.15, -size);
  ctx.lineTo(-size * 0.35, size * 0.1);
  ctx.lineTo(size * 0.05, size * 0.1);
  ctx.lineTo(-size * 0.15, size);
  ctx.lineTo(size * 0.45, -size * 0.15);
  ctx.lineTo(size * 0.05, -size * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
