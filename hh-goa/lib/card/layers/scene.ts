import type { SKRSContext2D } from "@napi-rs/canvas";
import { COLORS, FONT_FAMILY } from "../theme";
import { roundRectPath } from "../utils";

type Sign = { label: string; fill: string; text: string };

const SIGNS: Sign[] = [
  { label: "BUILD", fill: COLORS.yellow, text: COLORS.ink },
  { label: "SHIP", fill: COLORS.pink, text: COLORS.white },
  { label: "REPEAT", fill: COLORS.green, text: COLORS.white },
];

export function drawSignpost(ctx: SKRSContext2D, x: number, y: number) {
  const postW = 16;
  const postH = 230;

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  roundRectPath(ctx, x - postW / 2 + 4, y + 6, postW, postH, 6);
  ctx.fill();

  ctx.fillStyle = COLORS.brownDark;
  roundRectPath(ctx, x - postW / 2, y, postW, postH, 6);
  ctx.fill();

  ctx.fillStyle = COLORS.brown;
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.fill();

  const signH = 46;
  const signGap = 12;
  let signY = y + 20;

  for (let i = 0; i < SIGNS.length; i++) {
    const s = SIGNS[i];
    const w = 150 - i * 14;
    drawArrowSign(ctx, x - postW / 2 - 6, signY, w, signH, s.fill, s.text, s.label, false);
    signY += signH + signGap;
  }

  ctx.restore();
}

function drawArrowSign(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  textColor: string,
  label: string,
  pointLeft: boolean,
) {
  const point = 18;
  ctx.save();
  ctx.rotate(pointLeft ? 0.02 : -0.02);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  if (pointLeft) {
    ctx.moveTo(x + 3, y + 3);
    ctx.lineTo(x - w + 3, y + 3);
    ctx.lineTo(x - w + point + 3, y + h / 2 + 3);
    ctx.lineTo(x - w + 3, y + h + 3);
    ctx.lineTo(x + 3, y + h + 3);
  } else {
    ctx.moveTo(x + 3, y + 3);
    ctx.lineTo(x + w + 3, y + 3);
    ctx.lineTo(x + w - point + 3, y + h / 2 + 3);
    ctx.lineTo(x + w + 3, y + h + 3);
    ctx.lineTo(x + 3, y + h + 3);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = fill;
  ctx.beginPath();
  if (pointLeft) {
    ctx.moveTo(x, y);
    ctx.lineTo(x - w, y);
    ctx.lineTo(x - w + point, y + h / 2);
    ctx.lineTo(x - w, y + h);
    ctx.lineTo(x, y + h);
  } else {
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w - point, y + h / 2);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 20px ${FONT_FAMILY.poppinsBold}`;
  const textX = pointLeft ? x - w / 2 - point / 4 : x + w / 2 - point / 4;
  ctx.fillText(label, textX, y + h / 2 + 1);
  ctx.restore();
}

export function drawBeachScene(ctx: SKRSContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.translate(x, y);

  drawSand(ctx, 0, h - 40, w, 60);
  drawSurfboards(ctx, w * 0.05, h - 190, 3);
  drawPalmTree(ctx, w * 0.02, h - 170, 0.9);
  drawHouse(ctx, w * 0.28, h * 0.05, w * 0.62, h * 0.68);
  drawScooter(ctx, w * 0.3, h - 78, 0.85);

  ctx.restore();
}

function drawSand(ctx: SKRSContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.quadraticCurveTo(x + w * 0.5, y - 10, x + w, y + h);
  ctx.lineTo(x + w, y + h + 40);
  ctx.lineTo(x, y + h + 40);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPalmTree(ctx: SKRSContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.strokeStyle = COLORS.brownDark;
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(10, 150);
  ctx.quadraticCurveTo(-10, 80, 14, 0);
  ctx.stroke();

  ctx.fillStyle = COLORS.green;
  const fronds = [
    [-1, -0.2],
    [-0.7, -0.9],
    [-0.1, -1.15],
    [0.5, -0.9],
    [0.9, -0.3],
  ];
  for (const [fx, fy] of fronds) {
    ctx.save();
    ctx.translate(14, 0);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(fx * 45, fy * 40, fx * 85, fy * 70 - 10);
    ctx.quadraticCurveTo(fx * 40, fy * 30, 0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawSurfboards(ctx: SKRSContext2D, x: number, y: number, count: number) {
  const colors = [COLORS.pink, COLORS.yellow, COLORS.green];
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < count; i++) {
    ctx.save();
    ctx.translate(i * 22, i * 4);
    ctx.rotate(-0.12 + i * 0.02);
    roundRectPath(ctx, 0, 0, 26, 150, 13);
    ctx.fillStyle = COLORS.white;
    ctx.fill();
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = colors[i % colors.length];
    roundRectPath(ctx, 9, 20, 8, 110, 4);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawHouse(ctx: SKRSContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.translate(x, y);

  // walls
  ctx.fillStyle = COLORS.pink;
  ctx.fillRect(0, h * 0.32, w, h * 0.68);
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(0, h * 0.32, w, h * 0.68);

  // roof
  ctx.fillStyle = COLORS.green;
  ctx.beginPath();
  ctx.moveTo(-w * 0.08, h * 0.34);
  ctx.lineTo(w / 2, -h * 0.02);
  ctx.lineTo(w * 1.08, h * 0.34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // balcony rail
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.05, h * 0.58);
  ctx.lineTo(w * 0.95, h * 0.58);
  ctx.stroke();
  for (let i = 0; i <= 6; i++) {
    const px = w * 0.05 + (i * w * 0.9) / 6;
    ctx.beginPath();
    ctx.moveTo(px, h * 0.46);
    ctx.lineTo(px, h * 0.58);
    ctx.stroke();
  }

  // windows (upper)
  ctx.fillStyle = COLORS.yellow;
  ctx.fillRect(w * 0.14, h * 0.37, w * 0.22, h * 0.16);
  ctx.fillRect(w * 0.64, h * 0.37, w * 0.22, h * 0.16);
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(w * 0.14, h * 0.37, w * 0.22, h * 0.16);
  ctx.strokeRect(w * 0.64, h * 0.37, w * 0.22, h * 0.16);

  // door + lower window
  ctx.fillStyle = COLORS.greenDark;
  ctx.fillRect(w * 0.4, h * 0.68, w * 0.22, h * 0.32);
  ctx.strokeRect(w * 0.4, h * 0.68, w * 0.22, h * 0.32);

  ctx.fillStyle = COLORS.yellow;
  ctx.fillRect(w * 0.72, h * 0.72, w * 0.18, h * 0.16);
  ctx.strokeRect(w * 0.72, h * 0.72, w * 0.18, h * 0.16);

  ctx.restore();
}

function drawScooter(ctx: SKRSContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 3;

  // wheels
  ctx.fillStyle = COLORS.ink;
  ctx.beginPath();
  ctx.arc(10, 70, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(110, 70, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.arc(10, 70, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(110, 70, 7, 0, Math.PI * 2);
  ctx.fill();

  // body
  ctx.fillStyle = COLORS.pink;
  ctx.beginPath();
  ctx.moveTo(0, 70);
  ctx.quadraticCurveTo(-6, 40, 20, 34);
  ctx.lineTo(70, 30);
  ctx.quadraticCurveTo(100, 28, 108, 55);
  ctx.quadraticCurveTo(112, 66, 100, 70);
  ctx.lineTo(20, 70);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // seat
  ctx.fillStyle = COLORS.greenDark;
  roundRectPath(ctx, 55, 18, 40, 12, 6);
  ctx.fill();

  // handlebar
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(100, 30);
  ctx.lineTo(112, 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(100, 8);
  ctx.lineTo(124, 8);
  ctx.stroke();

  // front leg shield
  ctx.fillStyle = COLORS.yellow;
  ctx.beginPath();
  ctx.moveTo(96, 30);
  ctx.quadraticCurveTo(80, 30, 78, 60);
  ctx.lineTo(96, 60);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
