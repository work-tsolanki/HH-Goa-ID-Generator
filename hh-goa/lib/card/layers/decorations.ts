import type { SKRSContext2D } from "@napi-rs/canvas";
import { CARD_W, COLORS } from "../theme";
import { drawBird, drawSparkle } from "../utils";

export function drawTopDecorations(ctx: SKRSContext2D) {
  drawBird(ctx, CARD_W * 0.34, 70, 9, COLORS.green);
  drawBird(ctx, CARD_W * 0.38, 92, 7, COLORS.green);
  drawBird(ctx, CARD_W * 0.66, 60, 8, COLORS.green);

  drawSparkle(ctx, CARD_W * 0.28, 190, 8, COLORS.gold, 0.2);
  drawSparkle(ctx, CARD_W * 0.72, 160, 10, COLORS.pink, -0.4);
}

export function drawMidDecorations(ctx: SKRSContext2D, photoTop: number, photoBottom: number) {
  drawSparkle(ctx, 118, photoTop + 30, 10, COLORS.gold, 0.3);
  drawSparkle(ctx, CARD_W - 130, photoTop + 60, 9, COLORS.pink, -0.2);
  drawSparkle(ctx, 150, photoBottom - 40, 8, COLORS.pink, 0.5);
  drawSparkle(ctx, CARD_W - 110, photoBottom - 10, 11, COLORS.gold, -0.3);
}
