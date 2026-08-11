import type { SKRSContext2D } from "@napi-rs/canvas";
import { CARD_W, COLORS, FONT_FAMILY } from "../theme";
import {
  boldText,
  drawArcTextBottom,
  drawArcTextTop,
  drawDashedCircle,
  drawSparkle,
  drawVerticalText,
  roundRectPath,
} from "../utils";

const CX = CARD_W / 2;

export function drawTopRibbon(ctx: SKRSContext2D) {
  const w = 250;
  const h = 168;
  const x = CX - w / 2;
  const y = 0;
  const tail = 26;

  ctx.save();
  ctx.fillStyle = COLORS.pinkDark;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h - tail);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x, y + h - tail);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.pink;
  const inset = 7;
  ctx.beginPath();
  ctx.moveTo(x + inset, y);
  ctx.lineTo(x + w - inset, y);
  ctx.lineTo(x + w - inset, y + h - tail - 4);
  ctx.lineTo(x + w / 2, y + h - inset - 4);
  ctx.lineTo(x + inset, y + h - tail - 4);
  ctx.closePath();
  ctx.fill();

  // mounting slot
  ctx.fillStyle = COLORS.greenDark;
  roundRectPath(ctx, CX - 46, 30, 92, 16, 8);
  ctx.fill();

  // small palm glyph
  drawMiniPalm(ctx, CX, 78, 16, COLORS.gold);

  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.gold;
  ctx.font = `700 30px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillText("HH", CX, 122);
  ctx.font = `700 26px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillText("GOA", CX, 152);
  ctx.font = `600 22px ${FONT_FAMILY.poppinsSemiBold}`;
  ctx.fillText("2026", CX, 180);
  ctx.restore();
}

function drawMiniPalm(ctx: SKRSContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // trunk
  ctx.lineWidth = size * 0.14;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-size * 0.05, size * 0.65);
  ctx.quadraticCurveTo(size * 0.15, size * 0.25, 0, -size * 0.05);
  ctx.stroke();

  // fronds: teardrop leaves fanning from the crown
  const fronds: Array<[number, number]> = [
    [-1, -0.25],
    [-0.6, -0.85],
    [0, -1.05],
    [0.6, -0.85],
    [1, -0.25],
  ];
  for (const [fx, fy] of fronds) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.05);
    ctx.quadraticCurveTo(fx * size * 0.55, fy * size * 0.35, fx * size * 0.75, fy * size * 0.75);
    ctx.quadraticCurveTo(fx * size * 0.35, fy * size * 0.5, 0, -size * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

export function drawHeadline(ctx: SKRSContext2D, y: number) {
  const hackerFont = `62px ${FONT_FAMILY.zillaSlabBold}`;
  const houseFont = `62px ${FONT_FAMILY.zillaSlabBold}`;
  const devFont = `68px ${FONT_FAMILY.yatraOne}`;

  ctx.font = hackerFont;
  const hackerW = ctx.measureText("HACKER").width;
  ctx.font = devFont;
  const devW = ctx.measureText("गोवा").width;
  ctx.font = houseFont;
  const houseW = ctx.measureText("HOUSE").width;

  const gap = 20;
  const total = hackerW + gap + devW + gap + houseW;
  let x = CX - total / 2;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  ctx.font = hackerFont;
  boldText(ctx, "HACKER", x, y, { fill: COLORS.green, stroke: COLORS.green, strokeWidth: 2.5 });
  x += hackerW + gap;

  ctx.save();
  ctx.font = devFont;
  const devCenterX = x + devW / 2;
  ctx.translate(devCenterX, y - 6);
  ctx.rotate(-0.035);
  ctx.textAlign = "center";
  boldText(ctx, "गोवा", 0, 6, { fill: COLORS.pink, stroke: COLORS.pinkDark, strokeWidth: 1.5 });
  ctx.restore();
  x += devW + gap;

  ctx.textAlign = "left";
  ctx.font = houseFont;
  boldText(ctx, "HOUSE", x, y, { fill: COLORS.green, stroke: COLORS.green, strokeWidth: 2.5 });

  drawSparkle(ctx, CX - total / 2 - 26, y - 40, 10, COLORS.gold, 0.4);
  drawSparkle(ctx, CX + total / 2 + 26, y - 34, 12, COLORS.pink, -0.3);
}

export function drawPostageStamp(ctx: SKRSContext2D, x: number, y: number) {
  const w = 190;
  const h = 150;
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(-0.09);
  ctx.translate(-w / 2, -h / 2);

  ctx.fillStyle = "rgba(0,0,0,0.12)";
  roundRectPath(ctx, 4, 6, w, h, 6);
  ctx.fill();

  ctx.fillStyle = COLORS.white;
  roundRectPath(ctx, 0, 0, w, h, 6);
  ctx.fill();
  ctx.strokeStyle = COLORS.green;
  ctx.lineWidth = 2;
  roundRectPath(ctx, 0, 0, w, h, 6);
  ctx.stroke();

  ctx.strokeStyle = COLORS.green;
  ctx.lineWidth = 3;
  ctx.setLineDash([1, 9]);
  ctx.lineCap = "round";
  roundRectPath(ctx, 8, 8, w - 16, h - 16, 4);
  ctx.stroke();
  ctx.setLineDash([]);

  const pad = 16;
  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.green;
  ctx.font = `700 20px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillText("GOA", pad, 34);
  ctx.font = `600 12px ${FONT_FAMILY.poppinsSemiBold}`;
  ctx.fillText("INDIA", pad, 50);

  // little scene
  const sceneY = h - 62;
  ctx.save();
  ctx.beginPath();
  roundRectPath(ctx, pad, sceneY, w - pad * 2, 46, 4);
  ctx.clip();

  ctx.fillStyle = "#fdf3d8";
  ctx.fillRect(pad, sceneY, w - pad * 2, 46);

  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.arc(pad + 30, sceneY + 16, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.green;
  ctx.beginPath();
  ctx.ellipse(pad + (w - pad * 2) / 2, sceneY + 46, 70, 20, 0, Math.PI, 0, true);
  ctx.fill();

  ctx.strokeStyle = COLORS.pink;
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const wy = sceneY + 33 + i * 6;
    ctx.beginPath();
    ctx.moveTo(pad, wy);
    for (let wx = pad; wx <= w - pad; wx += 10) {
      ctx.lineTo(wx, wy + (Math.floor((wx - pad) / 10) % 2 === 0 ? -2 : 2));
    }
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
}

export function drawGoaBadge(ctx: SKRSContext2D, cx: number, cy: number, radius: number) {
  ctx.save();
  ctx.fillStyle = COLORS.white;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.green;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  drawDashedCircle(ctx, cx, cy, radius - 10, { color: COLORS.green, width: 2, dash: [3, 6] });

  drawArcTextTop(ctx, "BUILD IN GOA", cx, cy, radius - 26, {
    font: `700 15px ${FONT_FAMILY.poppinsBold}`,
    color: COLORS.green,
    letterSpacing: 1,
  });
  drawArcTextBottom(ctx, "SHIP FROM PARADISE", cx, cy, radius - 26, {
    font: `700 13px ${FONT_FAMILY.poppinsBold}`,
    color: COLORS.green,
    letterSpacing: 0.5,
  });

  drawSparkle(ctx, cx - 34, cy - 2, 6, COLORS.gold, 0.2);
  drawSparkle(ctx, cx + 34, cy - 2, 6, COLORS.gold, -0.2);
  drawMiniPalm(ctx, cx, cy + 6, 20, COLORS.pink);
  ctx.restore();
}

export function drawVerticalMargins(ctx: SKRSContext2D, cardH: number, x1: number, x2: number) {
  const midY = cardH * 0.52;
  drawVerticalText(ctx, "28 – 31 OCT 2026", x1, midY, {
    font: `700 26px ${FONT_FAMILY.poppinsBold}`,
    color: COLORS.pink,
    letterSpacing: 3,
    direction: -1,
  });
  drawVerticalText(ctx, "GOA, INDIA", x2, midY, {
    font: `700 26px ${FONT_FAMILY.poppinsBold}`,
    color: COLORS.green,
    letterSpacing: 4,
    direction: 1,
  });
}
