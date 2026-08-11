import type { SKRSContext2D } from "@napi-rs/canvas";
import { CARD_H, CARD_W, COLORS } from "../theme";
import { drawDotTexture, roundRectPath } from "../utils";

const BORDER = 34;
const GOLD_INSET = BORDER + 14;
const OUTER_R = 56;

export function drawFrame(ctx: SKRSContext2D) {
  // Outer dark-green border layer
  ctx.fillStyle = COLORS.green;
  roundRectPath(ctx, 0, 0, CARD_W, CARD_H, OUTER_R);
  ctx.fill();

  // Cream card body
  const innerR = OUTER_R - BORDER;
  ctx.fillStyle = COLORS.cream;
  roundRectPath(ctx, BORDER, BORDER, CARD_W - BORDER * 2, CARD_H - BORDER * 2, innerR);
  ctx.fill();

  // Subtle dot texture across the cream body (clipped)
  ctx.save();
  roundRectPath(ctx, BORDER, BORDER, CARD_W - BORDER * 2, CARD_H - BORDER * 2, innerR);
  ctx.clip();
  drawDotTexture(ctx, BORDER, BORDER, CARD_W - BORDER * 2, CARD_H - BORDER * 2, {
    color: COLORS.creamDot,
    gap: 26,
    radius: 1.6,
  });
  ctx.restore();

  // Gold inner border
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 5;
  roundRectPath(
    ctx,
    GOLD_INSET,
    GOLD_INSET,
    CARD_W - GOLD_INSET * 2,
    CARD_H - GOLD_INSET * 2,
    innerR - 14,
  );
  ctx.stroke();
}

export const CONTENT_PAD = GOLD_INSET + 30;
