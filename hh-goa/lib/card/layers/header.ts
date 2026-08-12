import type { Image, SKRSContext2D } from "@napi-rs/canvas";
import { CARD_W, COLORS, FONT_FAMILY } from "../theme";
import { CONTENT_PAD, HEADER_H } from "./frame";
import { drawPhotoFrame, drawVerifiedBadge } from "./photo";
import { fitText } from "../utils";

/** Dark-forest gradient header block: brand lockup, MEMBER pill, portrait + pass-detail grid, wave hem. */
export function drawHeader(ctx: SKRSContext2D, photo: Image, builderId: string) {
  const grad = ctx.createLinearGradient(0, 0, CARD_W * 0.35, HEADER_H);
  grad.addColorStop(0, COLORS.forestTop);
  grad.addColorStop(0.55, COLORS.forestMid);
  grad.addColorStop(1, COLORS.forestDeep);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CARD_W, HEADER_H);

  drawBrandRow(ctx);
  drawPortraitRow(ctx, photo, builderId);
  drawWaveHem(ctx);
}

function drawBrandRow(ctx: SKRSContext2D) {
  const x = CONTENT_PAD;
  const y = CONTENT_PAD + 24;

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const hackerFont = `700 31px ${FONT_FAMILY.body}`;
  const devFont = `600 30px ${FONT_FAMILY.devanagari}`;
  ctx.font = hackerFont;
  const hackerW = ctx.measureText("HACKER ").width;
  ctx.font = devFont;
  const devW = ctx.measureText("गोवा").width;

  ctx.font = hackerFont;
  ctx.fillStyle = COLORS.cream;
  ctx.fillText("HACKER ", x, y);
  ctx.font = devFont;
  ctx.fillStyle = COLORS.gold;
  ctx.fillText("गोवा", x + hackerW, y);
  ctx.font = hackerFont;
  ctx.fillStyle = COLORS.cream;
  ctx.fillText(" HOUSE", x + hackerW + devW, y);

  ctx.font = `500 18px ${FONT_FAMILY.body}`;
  ctx.fillStyle = "rgba(243,231,206,.55)";
  ctx.fillText("RESIDENCY 2026 · BUILDER PASS", x, y + 30);

  ctx.font = `500 16px ${FONT_FAMILY.body}`;
  ctx.fillStyle = "rgba(231,179,60,.75)";
  ctx.fillText("ACCESS ALL STATIONS OF THE BUILD", x, y + 56);
  ctx.restore();

  // MEMBER pill, top right
  const pillLabel = "MEMBER";
  ctx.save();
  ctx.font = `500 18px ${FONT_FAMILY.body}`;
  const pillW = ctx.measureText(pillLabel).width + 46;
  const pillH = 46;
  const pillX = CARD_W - CONTENT_PAD - pillW;
  const pillY = CONTENT_PAD - 8;
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pillLabel, pillX + pillW / 2, pillY + pillH / 2 + 1);
  ctx.restore();
}

function drawPortraitRow(ctx: SKRSContext2D, photo: Image, builderId: string) {
  const photoX = CONTENT_PAD;
  const photoY = CONTENT_PAD + 130;
  const photoW = 455;
  const photoH = 507;
  const photoLayout = { x: photoX, y: photoY, w: photoW, h: photoH };

  drawPhotoFrame(ctx, photo, photoLayout);
  drawVerifiedBadge(ctx, photoLayout);

  const dividerX = photoX + photoW + 44;
  ctx.save();
  const dividerGrad = ctx.createLinearGradient(0, photoY, 0, photoY + photoH);
  dividerGrad.addColorStop(0, "rgba(243,231,206,0)");
  dividerGrad.addColorStop(0.18, "rgba(243,231,206,.28)");
  dividerGrad.addColorStop(0.82, "rgba(243,231,206,.28)");
  dividerGrad.addColorStop(1, "rgba(243,231,206,0)");
  ctx.fillStyle = dividerGrad;
  ctx.fillRect(dividerX, photoY, 2, photoH);
  ctx.restore();

  const colX = dividerX + 46;
  const gridRight = CARD_W - CONTENT_PAD;
  const gridW = gridRight - colX;
  const colGap = 29;
  const colW = (gridW - colGap) / 2;
  const col0X = colX;
  const col1X = colX + colW + colGap;
  // Bigger type and taller rows than the comp's own cramped list — the
  // green header has far more room beside the photo than six small stat
  // lines used to fill, so the grid is enlarged and vertically centered
  // against the photo instead of shrinking to a corner.
  const rowStep = 160;
  const gridBlockH = rowStep * 2 + 36;
  const gridTop = photoY + (photoH - gridBlockH) / 2;

  const cells: Array<[string, string, number, number, string?]> = [
    ["DATES", "28 – 31 OCT 2026", col0X, gridTop],
    ["VENUE", "ANJUNA, GOA", col1X, gridTop],
    ["COHORT", "GOA · 2026", col0X, gridTop + rowStep],
    ["ZONE", "ALL BUILD FLOORS", col1X, gridTop + rowStep],
    ["PASS NO.", builderId, col0X, gridTop + rowStep * 2, COLORS.gold],
    ["STATUS", "VERIFIED", col1X, gridTop + rowStep * 2, COLORS.gold],
  ];

  for (const [label, value, cx, labelY, valueColor] of cells) {
    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `600 18px ${FONT_FAMILY.body}`;
    ctx.fillStyle = "rgba(243,231,206,.45)";
    ctx.fillText(label, cx, labelY);

    const valueY = labelY + 36;
    const size = fitText(ctx, value, colW, FONT_FAMILY.body, 30, 18);
    ctx.font = `700 ${size}px ${FONT_FAMILY.body}`;
    ctx.fillStyle = valueColor ?? COLORS.cream;
    ctx.fillText(value, cx, valueY);

    if (label === "STATUS") {
      const valueW = ctx.measureText(value).width;
      drawCheckBadge(ctx, cx + valueW + 14, valueY - 10, 14, COLORS.gold);
    }
    ctx.restore();
  }
}

function drawCheckBadge(ctx: SKRSContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.45, cy + r * 0.05);
  ctx.lineTo(cx - r * 0.1, cy + r * 0.4);
  ctx.lineTo(cx + r * 0.5, cy - r * 0.35);
  ctx.stroke();
  ctx.restore();
}

/** A scalloped cream hem where the header block meets the body — the pass's one flourish seam. */
function drawWaveHem(ctx: SKRSContext2D) {
  const baseY = HEADER_H - 3;
  const amp = 18;
  const period = CARD_W / 4;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  for (let i = 0; i < 4; i++) {
    const x0 = i * period;
    ctx.quadraticCurveTo(x0 + period * 0.25, baseY - amp, x0 + period * 0.5, baseY);
    ctx.quadraticCurveTo(x0 + period * 0.75, baseY + amp, x0 + period, baseY);
  }
  ctx.lineTo(CARD_W, HEADER_H + 40);
  ctx.lineTo(0, HEADER_H + 40);
  ctx.closePath();
  ctx.fillStyle = COLORS.cream;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  for (let i = 0; i < 4; i++) {
    const x0 = i * period;
    ctx.quadraticCurveTo(x0 + period * 0.25, baseY - amp, x0 + period * 0.5, baseY);
    ctx.quadraticCurveTo(x0 + period * 0.75, baseY + amp, x0 + period, baseY);
  }
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.restore();
}