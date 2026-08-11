import type { Image, SKRSContext2D } from "@napi-rs/canvas";
import { COLORS, FONT_FAMILY } from "../theme";
import { drawScanlines } from "../utils";

export type PhotoFrameLayout = {
  x: number;
  y: number;
  size: number;
};

const BRACKET_LEN = 46;
const BRACKET_W = 5;
const INSET = 10;

export function drawPhotoFrame(ctx: SKRSContext2D, photo: Image, layout: PhotoFrameLayout) {
  const { x, y, size } = layout;

  // Center-cropped photo, filling the viewfinder regardless of source aspect ratio.
  ctx.save();
  ctx.beginPath();
  ctx.rect(x + INSET, y + INSET, size - INSET * 2, size - INSET * 2);
  ctx.clip();

  const targetSize = size - INSET * 2;
  const imgW = photo.width;
  const imgH = photo.height;
  const scale = Math.max(targetSize / imgW, targetSize / imgH);
  const sw = targetSize / scale;
  const sh = targetSize / scale;
  const sx = (imgW - sw) / 2;
  const sy = (imgH - sh) / 2;

  ctx.drawImage(photo, sx, sy, sw, sh, x + INSET, y + INSET, targetSize, targetSize);

  // Slight darken + scanlines over the photo so it reads as a camera feed, not a pasted photo.
  ctx.fillStyle = "rgba(11,13,12,0.18)";
  ctx.fillRect(x + INSET, y + INSET, targetSize, targetSize);
  drawScanlines(ctx, x + INSET, y + INSET, targetSize, targetSize, {
    color: "#000000",
    gap: 5,
    opacity: 0.12,
  });
  ctx.restore();

  // Reticle corner brackets — the signature shape of this world, replacing a decorative ring.
  ctx.save();
  ctx.strokeStyle = COLORS.amber;
  ctx.lineWidth = BRACKET_W;
  ctx.lineCap = "square";
  const corners: Array<[number, number, number, number]> = [
    [x, y, 1, 1],
    [x + size, y, -1, 1],
    [x, y + size, 1, -1],
    [x + size, y + size, -1, -1],
  ];
  for (const [cx, cy, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + BRACKET_LEN * dy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + BRACKET_LEN * dx, cy);
    ctx.stroke();
  }
  ctx.restore();

  // CAM_01 // LIVE label, top-left, like a camera app overlay.
  ctx.save();
  ctx.fillStyle = COLORS.red;
  ctx.beginPath();
  ctx.arc(x + 26, y - 22, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.textDim;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `15px ${FONT_FAMILY.monoRegular}`;
  ctx.fillText("CAM_01 // LIVE", x + 40, y - 21);
  ctx.restore();
}
