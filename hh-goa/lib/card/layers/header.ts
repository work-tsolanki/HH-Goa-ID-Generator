import type { SKRSContext2D } from "@napi-rs/canvas";
import { CARD_W, COLORS, FONT_FAMILY } from "../theme";
import { drawTrafficLights, fitText } from "../utils";

export const TITLE_BAR_H = 72;

export function drawTitleBar(ctx: SKRSContext2D) {
  ctx.save();
  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(0, 0, CARD_W, TITLE_BAR_H);
  ctx.strokeStyle = COLORS.hairline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, TITLE_BAR_H);
  ctx.lineTo(CARD_W, TITLE_BAR_H);
  ctx.stroke();

  drawTrafficLights(ctx, 44, TITLE_BAR_H / 2, {
    radius: 8,
    gap: 26,
    colors: [COLORS.red, COLORS.yellow, COLORS.green],
  });

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.textDim;
  ctx.font = `18px ${FONT_FAMILY.monoRegular}`;
  ctx.fillText("hacker-house-goa.sh — 82×40", 140, TITLE_BAR_H / 2 + 1);

  ctx.textAlign = "right";
  ctx.fillStyle = COLORS.amber;
  ctx.font = `16px ${FONT_FAMILY.monoSemiBold}`;
  const statusLabel = "LIVE  28–31 OCT 2026";
  ctx.fillText(statusLabel, CARD_W - 40, TITLE_BAR_H / 2 + 1);

  const dotOffset = ctx.measureText(statusLabel).width + 14;
  ctx.beginPath();
  ctx.arc(CARD_W - 40 - dotOffset, TITLE_BAR_H / 2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawBootLines(ctx: SKRSContext2D, x: number, startY: number): number {
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  let y = startY;
  ctx.fillStyle = COLORS.amber;
  ctx.font = `700 26px ${FONT_FAMILY.monoBold}`;
  ctx.fillText("$ ssh builder@hackerhouse.goa", x, y);

  y += 32;
  ctx.fillStyle = COLORS.green;
  ctx.font = `16px ${FONT_FAMILY.monoRegular}`;
  ctx.fillText("connecting to GOA, IN (15.2993°N, 74.1240°E)… ok", x, y);

  y += 26;
  ctx.fillText("authenticating builder session… access granted", x, y);

  return y;
}

export function drawWordmark(ctx: SKRSContext2D, y: number) {
  const cx = CARD_W / 2;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const label = "HACKER_HOUSE // GOA";
  const size = fitText(ctx, label, CARD_W - 160, FONT_FAMILY.monoBold, 58, 34);
  ctx.font = `700 ${size}px ${FONT_FAMILY.monoBold}`;
  ctx.fillStyle = COLORS.textBright;
  ctx.fillText(label, cx, y);

  ctx.restore();
}
