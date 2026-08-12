import type { Image, SKRSContext2D } from "@napi-rs/canvas";
import { CARD_W, COLORS, FONT_FAMILY } from "../theme";
import { CONTENT_PAD, HEADER_H } from "./frame";
import { drawPhotoFrame } from "./photo";
import { fitText } from "../utils";

/** Dark-forest gradient header block: brand lockup, MEMBER pill, portrait + pass-detail column, wave hem. */
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
  const y = CONTENT_PAD + 6;

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
  ctx.fillText("RESIDENCY 2026 · BUILDER PASS", x, y + 34);
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
  ctx.fillStyle = COLORS.forestMid;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pillLabel, pillX + pillW / 2, pillY + pillH / 2 + 1);
  ctx.restore();
}

function drawPortraitRow(ctx: SKRSContext2D, photo: Image, builderId: string) {
  const photoX = CONTENT_PAD;
  const photoY = CONTENT_PAD + 60;
  const photoW = 494;
  const photoH = 572;

  drawPhotoFrame(ctx, photo, { x: photoX, y: photoY, w: photoW, h: photoH });

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

  const colX = dividerX + 44;
  const colW = CARD_W - CONTENT_PAD - colX;
  let y = photoY + 13;

  const rows: Array<[string, string]> = [
    ["DATES", "28 – 31 OCT 2026"],
    ["LOCATION", "ANJUNA · GOA, INDIA"],
    ["PASS NO.", builderId],
  ];

  rows.forEach(([label, value], i) => {
    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `500 17px ${FONT_FAMILY.body}`;
    ctx.fillStyle = "rgba(243,231,206,.5)";
    ctx.fillText(label, colX, y + 17);

    const valueY = y + 51;
    const size = fitText(ctx, value, colW, FONT_FAMILY.body, 27, 17);
    ctx.font = `700 ${size}px ${FONT_FAMILY.body}`;
    ctx.fillStyle = label === "PASS NO." ? COLORS.gold : COLORS.cream;
    ctx.fillText(value, colX, valueY);
    ctx.restore();

    y = valueY + 27;
    if (i < rows.length - 1) {
      ctx.save();
      ctx.strokeStyle = "rgba(243,231,206,.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(colX, y);
      ctx.lineTo(CARD_W - CONTENT_PAD, y);
      ctx.stroke();
      ctx.restore();
      y += 27;
    }
  });
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
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}
