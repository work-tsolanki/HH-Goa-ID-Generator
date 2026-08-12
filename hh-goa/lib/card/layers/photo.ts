import type { Image, SKRSContext2D } from "@napi-rs/canvas";
import { COLORS } from "../theme";
import { roundRectPath } from "../utils";

export type PhotoFrameLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const RADIUS = { tl: 247, tr: 247, br: 18, bl: 18 };

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
