import type { Image, SKRSContext2D } from "@napi-rs/canvas";
import { COLORS, FONT_FAMILY } from "../theme";
import { roundRectPath } from "../utils";

export type PhotoFrameLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const RADIUS = { tl: 228, tr: 228, br: 18, bl: 18 };

/** The pill-topped portrait frame — this comp's signature shape, not a plain rectangle. */
export function drawPhotoFrame(ctx: SKRSContext2D, photo: Image, layout: PhotoFrameLayout) {
  const { x, y, w, h } = layout;

  ctx.save();
  roundRectPath(ctx, x, y, w, h, RADIUS);
  ctx.clip();

  ctx.fillStyle = COLORS.forestDeep;
  ctx.fillRect(x, y, w, h);

  const imgW = photo.width;
  const imgH = photo.height;
  const scale = Math.max(w / imgW, h / imgH);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (imgW - sw) / 2;
  const sy = (imgH - sh) / 2;

  ctx.drawImage(photo, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 4;
  roundRectPath(ctx, x, y, w, h, RADIUS);
  ctx.stroke();
  ctx.restore();
}

/** The rotated "VERIFIED / HH / BUILDER" seal pinned over the portrait's bottom-right corner. */
export function drawVerifiedBadge(ctx: SKRSContext2D, layout: PhotoFrameLayout) {
  const { x, y, w, h } = layout;
  const size = 112;
  const cx = x + w - 16 - size / 2;
  const cy = y + h - 16 - size / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-9 * Math.PI) / 180);

  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.pink;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(243,231,206,.75)";
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(243,231,206,.9)";

  ctx.textBaseline = "alphabetic";
  ctx.font = `500 12px ${FONT_FAMILY.body}`;
  ctx.fillText("VERIFIED", 0, -20);

  ctx.textBaseline = "middle";
  ctx.font = `27px ${FONT_FAMILY.display}`;
  ctx.fillStyle = COLORS.cream;
  ctx.fillText("HH", 0, 2);

  ctx.textBaseline = "alphabetic";
  ctx.font = `500 12px ${FONT_FAMILY.body}`;
  ctx.fillStyle = "rgba(243,231,206,.9)";
  ctx.fillText("BUILDER", 0, 28);

  ctx.restore();
}
