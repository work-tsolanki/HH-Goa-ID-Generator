import type { SKRSContext2D } from "@napi-rs/canvas";
import { CARD_H, CARD_W, COLORS } from "../theme";
import { roundRectPath } from "../utils";

const OUTER_R = 28;
const BORDER_INSET = 10;

export function drawFrame(ctx: SKRSContext2D) {
  ctx.fillStyle = COLORS.green;
  roundRectPath(ctx, 0, 0, CARD_W, CARD_H, OUTER_R);
  ctx.fill();

  // A single quiet gold hairline — no thick decorative postcard border, no scallop ring.
  ctx.strokeStyle = COLORS.goldDim;
  ctx.lineWidth = 2;
  roundRectPath(
    ctx,
    BORDER_INSET,
    BORDER_INSET,
    CARD_W - BORDER_INSET * 2,
    CARD_H - BORDER_INSET * 2,
    OUTER_R - 6,
  );
  ctx.stroke();
}

export const CONTENT_PAD = 88;
