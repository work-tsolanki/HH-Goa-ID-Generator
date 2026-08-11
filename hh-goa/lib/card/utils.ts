import type { SKRSContext2D } from "@napi-rs/canvas";

export function roundRectPath(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | { tl: number; tr: number; br: number; bl: number },
) {
  const rad = typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r;
  ctx.beginPath();
  ctx.moveTo(x + rad.tl, y);
  ctx.lineTo(x + w - rad.tr, y);
  ctx.arcTo(x + w, y, x + w, y + rad.tr, rad.tr);
  ctx.lineTo(x + w, y + h - rad.br);
  ctx.arcTo(x + w, y + h, x + w - rad.br, y + h, rad.br);
  ctx.lineTo(x + rad.bl, y + h);
  ctx.arcTo(x, y + h, x, y + h - rad.bl, rad.bl);
  ctx.lineTo(x, y + rad.tl);
  ctx.arcTo(x, y, x + rad.tl, y, rad.tl);
  ctx.closePath();
}

export function fitText(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
  family: string,
  startSize: number,
  minSize: number,
): number {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 1;
  }
  return size;
}

/** A quiet horizontal rule — the only divider device this restrained world uses. */
export function drawRule(ctx: SKRSContext2D, x: number, y: number, w: number, color: string, weight = 1.5) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = weight;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();
  ctx.restore();
}

/** A single-stroke palm leaf — the one restrained beach motif allowed on the card face. */
export function drawPalmAccent(ctx: SKRSContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  const fronds: Array<[number, number]> = [
    [-1, -0.15],
    [-0.55, -0.85],
    [0, -1.05],
    [0.55, -0.85],
    [1, -0.15],
  ];
  for (const [fx, fy] of fronds) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(fx * size * 0.5, fy * size * 0.35, fx * size * 0.72, fy * size * 0.72);
    ctx.quadraticCurveTo(fx * size * 0.32, fy * size * 0.48, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
