import type { Image, SKRSContext2D } from "@napi-rs/canvas";
import { COLORS } from "../theme";
import { roundRectPath } from "../utils";

export type PhotoFrameLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const RADIUS = 10;

export function drawPhotoFrame(ctx: SKRSContext2D, photo: Image, layout: PhotoFrameLayout) {
  const { x, y, w, h } = layout;

  ctx.save();
  roundRectPath(ctx, x, y, w, h, RADIUS);
  ctx.clip();

  const imgW = photo.width;
  const imgH = photo.height;
  const scale = Math.max(w / imgW, h / imgH);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (imgW - sw) / 2;
  const sy = (imgH - sh) / 2;

  ctx.drawImage(photo, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();

  // A single quiet gold frame — no scallop ring, no reticle brackets.
  ctx.save();
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 3;
  roundRectPath(ctx, x, y, w, h, RADIUS);
  ctx.stroke();
  ctx.restore();
}
