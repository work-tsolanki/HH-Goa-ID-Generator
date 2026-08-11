import type { SKRSContext2D } from "@napi-rs/canvas";
import { CARD_W, COLORS, FONT_FAMILY } from "../theme";
import { drawPalmAccent, fitText } from "../utils";

const CX = CARD_W / 2;

export function drawWordmark(ctx: SKRSContext2D, y: number): number {
  ctx.save();
  ctx.textBaseline = "alphabetic";

  const hackerFont = `62px ${FONT_FAMILY.display}`;
  const houseFont = `62px ${FONT_FAMILY.display}`;
  const devFont = `54px ${FONT_FAMILY.devanagari}`;

  ctx.font = hackerFont;
  const hackerW = ctx.measureText("HACKER").width;
  ctx.font = devFont;
  const devW = ctx.measureText("गोवा").width;
  ctx.font = houseFont;
  const houseW = ctx.measureText("HOUSE").width;

  const gap = 22;
  const total = hackerW + gap + devW + gap + houseW;
  let x = CX - total / 2;

  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.gold;
  ctx.font = hackerFont;
  ctx.fillText("HACKER", x, y);
  x += hackerW + gap;

  ctx.fillStyle = COLORS.pink;
  ctx.font = devFont;
  ctx.fillText("गोवा", x, y);
  x += devW + gap;

  ctx.fillStyle = COLORS.gold;
  ctx.font = houseFont;
  ctx.fillText("HOUSE", x, y);

  drawPalmAccent(ctx, CX - total / 2 - 46, y - 34, 30, COLORS.textDim);
  drawPalmAccent(ctx, CX + total / 2 + 46, y - 34, 30, COLORS.textDim);

  ctx.restore();
  return y;
}

export function drawSubline(ctx: SKRSContext2D, y: number) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const label = "GOA, INDIA  ·  28–31 OCT 2026";
  const size = fitText(ctx, label, CARD_W - 200, FONT_FAMILY.poppinsSemiBold, 22, 14);
  ctx.font = `600 ${size}px ${FONT_FAMILY.poppinsSemiBold}`;
  ctx.fillStyle = COLORS.textDim;
  ctx.fillText(label, CARD_W / 2, y);
  ctx.restore();
}
