import type { SKRSContext2D } from "@napi-rs/canvas";
import { CARD_H, CARD_W, COLORS } from "../theme";
import { drawScanlines, roundRectPath } from "../utils";

const OUTER_R = 20;
const BORDER_INSET = 6;

export function drawFrame(ctx: SKRSContext2D) {
  // Base terminal-black fill, full bleed.
  ctx.fillStyle = COLORS.bg;
  roundRectPath(ctx, 0, 0, CARD_W, CARD_H, OUTER_R);
  ctx.fill();

  // CRT scanline texture across the whole card, clipped to the rounded body.
  ctx.save();
  roundRectPath(ctx, 0, 0, CARD_W, CARD_H, OUTER_R);
  ctx.clip();
  drawScanlines(ctx, 0, 0, CARD_W, CARD_H, { color: "#ffffff", gap: 4, opacity: 0.02 });
  ctx.restore();

  // Single hairline amber border — a terminal window's edge, not a decorative frame.
  ctx.strokeStyle = COLORS.amberDim;
  ctx.lineWidth = 2;
  roundRectPath(
    ctx,
    BORDER_INSET,
    BORDER_INSET,
    CARD_W - BORDER_INSET * 2,
    CARD_H - BORDER_INSET * 2,
    OUTER_R - 4,
  );
  ctx.stroke();
}

export const CONTENT_PAD = 52;
