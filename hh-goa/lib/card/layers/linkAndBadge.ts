import type { SKRSContext2D } from "@napi-rs/canvas";
import { COLORS, FONT_FAMILY } from "../theme";
import { fitText } from "../utils";

/** The builder's name — the card's largest identity element, set in the display serif. */
export function drawName(ctx: SKRSContext2D, cx: number, y: number, name: string, maxWidth: number): number {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const size = fitText(ctx, name, maxWidth, FONT_FAMILY.display, 56, 28);
  ctx.font = `${size}px ${FONT_FAMILY.display}`;
  ctx.fillStyle = COLORS.cream;
  ctx.fillText(name, cx, y);
  ctx.restore();
  return y;
}

/** A quiet small-caps tag — role, builder class, etc. Label above, value below. */
export function drawLabelValue(
  ctx: SKRSContext2D,
  cx: number,
  y: number,
  label: string,
  value: string,
  opts: { valueColor?: string; maxWidth: number },
): number {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.font = `600 15px ${FONT_FAMILY.poppinsSemiBold}`;
  ctx.fillStyle = COLORS.textDim;
  ctx.fillText(label.toUpperCase(), cx, y);

  const valueY = y + 34;
  const size = fitText(ctx, value, opts.maxWidth, FONT_FAMILY.poppinsBold, 26, 16);
  ctx.font = `700 ${size}px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillStyle = opts.valueColor ?? COLORS.cream;
  ctx.fillText(value, cx, valueY);

  ctx.restore();
  return valueY;
}

/** Optional social link — a quiet underlined line, only rendered when a real URL was given. */
export function drawSocialLink(ctx: SKRSContext2D, cx: number, y: number, url: string, maxWidth: number): number {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const size = fitText(ctx, url, maxWidth, FONT_FAMILY.poppinsMedium, 18, 13);
  ctx.font = `500 ${size}px ${FONT_FAMILY.poppinsMedium}`;
  ctx.fillStyle = COLORS.gold;
  ctx.fillText(url, cx, y);

  const w = ctx.measureText(url).width;
  ctx.strokeStyle = COLORS.goldDim;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, y + 6);
  ctx.lineTo(cx + w / 2, y + 6);
  ctx.stroke();

  ctx.restore();
  return y + 6;
}
