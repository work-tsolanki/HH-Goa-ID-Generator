import type { Image, SKRSContext2D } from "@napi-rs/canvas";
import { COLORS, FONT_FAMILY } from "../theme";

export type PhotoFrameLayout = {
  cx: number;
  cy: number;
  outerRadius: number;
  innerRadius: number;
};

export function drawPhotoFrame(ctx: SKRSContext2D, photo: Image, layout: PhotoFrameLayout) {
  const { cx, cy, outerRadius, innerRadius } = layout;

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.arc(cx + 6, cy + 10, outerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Scalloped rickrack ring: alternating red/white bumps
  const ringMid = (outerRadius + innerRadius) / 2;
  const bumpRadius = (outerRadius - innerRadius) / 2 + 2;
  const circumference = 2 * Math.PI * ringMid;
  const count = Math.max(24, Math.round(circumference / (bumpRadius * 1.35)));

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const bx = cx + ringMid * Math.cos(angle);
    const by = cy + ringMid * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(bx, by, bumpRadius, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? COLORS.red : COLORS.white;
    ctx.fill();
  }

  // clean inner/outer edges
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius + 1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius - 1, 0, Math.PI * 2);
  ctx.stroke();

  // Photo, center-cropped to cover the inner circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius - 5, 0, Math.PI * 2);
  ctx.clip();

  const targetSize = (innerRadius - 5) * 2;
  const targetX = cx - innerRadius + 5;
  const targetY = cy - innerRadius + 5;

  const imgW = photo.width;
  const imgH = photo.height;
  const scale = Math.max(targetSize / imgW, targetSize / imgH);
  const sw = targetSize / scale;
  const sh = targetSize / scale;
  const sx = (imgW - sw) / 2;
  const sy = (imgH - sh) / 2;

  ctx.drawImage(photo, sx, sy, sw, sh, targetX, targetY, targetSize, targetSize);
  ctx.restore();

  ctx.strokeStyle = COLORS.green;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius - 5, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawStickyNote(ctx: SKRSContext2D, x: number, y: number) {
  const w = 150;
  const h = 96;
  const fold = 20;

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(0.09);
  ctx.translate(-w / 2, -h / 2);

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.moveTo(4, 4);
  ctx.lineTo(w + 4, 4);
  ctx.lineTo(w + 4, h + 4);
  ctx.lineTo(4, h + 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.yellow;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w - fold, 0);
  ctx.lineTo(w, fold);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = COLORS.yellowDark;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = COLORS.yellowDark;
  ctx.beginPath();
  ctx.moveTo(w - fold, 0);
  ctx.lineTo(w, fold);
  ctx.lineTo(w - fold, fold);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "center";
  ctx.font = `700 22px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillText("LET'S", w / 2 - 4, h / 2 - 2);
  ctx.fillText("BUILD!", w / 2 - 4, h / 2 + 26);
  ctx.restore();

  // little spark accents beside the note
  ctx.save();
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  const sparkX = x + w - 6;
  const sparkY = y - 6;
  ctx.beginPath();
  ctx.moveTo(sparkX, sparkY);
  ctx.lineTo(sparkX + 14, sparkY - 10);
  ctx.moveTo(sparkX + 6, sparkY + 4);
  ctx.lineTo(sparkX + 22, sparkY + 2);
  ctx.stroke();
  ctx.restore();
}
