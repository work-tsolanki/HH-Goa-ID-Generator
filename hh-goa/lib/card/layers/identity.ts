import type { SKRSContext2D } from "@napi-rs/canvas";
import { COLORS, FONT_FAMILY } from "../theme";
import { fitText } from "../utils";

/** The builder's name — largest element on the pass body, set in the black display face. */
export function drawName(ctx: SKRSContext2D, x: number, y: number, name: string, maxWidth: number): number {
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const upper = name.toUpperCase();
  const size = fitText(ctx, upper, maxWidth, FONT_FAMILY.display, 109, 44);
  ctx.font = `${size}px ${FONT_FAMILY.display}`;
  ctx.fillStyle = COLORS.ink;
  ctx.fillText(upper, x, y);
  ctx.restore();
  return y;
}

/** The stack/role line directly under the name — the one place hot pink appears on the card. */
export function drawStackLine(ctx: SKRSContext2D, x: number, y: number, stack: string): number {
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 27px ${FONT_FAMILY.body}`;
  ctx.fillStyle = COLORS.pink;
  ctx.fillText(stack, x, y);
  ctx.restore();
  return y;
}

/** The two-column BUILDER CLASS / CURRENTLY SHIPPING grid. */
export function drawIdentityGrid(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  builderClass: string,
  tagline: string,
): number {
  const colGap = 39;
  const colW = (width - colGap) / 2;

  const cells: Array<[string, string, number]> = [
    ["BUILDER CLASS", builderClass, x],
    ["CURRENTLY SHIPPING", tagline, x + colW + colGap],
  ];

  let maxBottom = y;
  for (const [label, value, cx] of cells) {
    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `500 17px ${FONT_FAMILY.body}`;
    ctx.fillStyle = "rgba(11,51,37,.55)";
    ctx.fillText(label, cx, y);

    const valueY = y + 33;
    const size = fitText(ctx, value, colW, FONT_FAMILY.body, 30, 18);
    ctx.font = `700 ${size}px ${FONT_FAMILY.body}`;
    ctx.fillStyle = COLORS.ink;
    ctx.fillText(value, cx, valueY);
    ctx.restore();

    maxBottom = Math.max(maxBottom, valueY);
  }

  return maxBottom;
}
