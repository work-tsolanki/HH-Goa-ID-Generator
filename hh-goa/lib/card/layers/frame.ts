import type { SKRSContext2D } from "@napi-rs/canvas";
import { CARD_H, CARD_W, COLORS } from "../theme";
import { roundRectPath } from "../utils";

const OUTER_R = 39;

/** The cream laminate face. Corners only — the pass has no border stroke, just a clipped card shape. */
export function drawFrame(ctx: SKRSContext2D) {
  ctx.fillStyle = COLORS.cream;
  roundRectPath(ctx, 0, 0, CARD_W, CARD_H, OUTER_R);
  ctx.fill();
}

export function clipFrame(ctx: SKRSContext2D) {
  roundRectPath(ctx, 0, 0, CARD_W, CARD_H, OUTER_R);
  ctx.clip();
}

export const CONTENT_PAD = 65;
export const HEADER_H = 832;
