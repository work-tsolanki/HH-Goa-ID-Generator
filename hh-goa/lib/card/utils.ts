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

/** A rounded rect with small semicircle "die-cut" bumps along each edge,
 * like a postage stamp's perforated border. `bumps` controls how many
 * scallops run along the shorter (vertical) edges; the horizontal edges
 * get a proportional count so spacing stays even. */
export function roundedStampPath(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  bumpRadius: number,
) {
  const bumpsX = Math.max(2, Math.round(w / (bumpRadius * 2.4)));
  const bumpsY = Math.max(2, Math.round(h / (bumpRadius * 2.4)));
  const stepX = w / bumpsX;
  const stepY = h / bumpsY;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  for (let i = 0; i < bumpsX; i++) {
    const cx = x + r + i * stepX + (stepX - r) / 2;
    ctx.lineTo(cx - bumpRadius, y);
    ctx.arc(cx, y, bumpRadius, Math.PI, 0, true);
  }
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  for (let i = 0; i < bumpsY; i++) {
    const cy = y + r + i * stepY + (stepY - r) / 2;
    ctx.lineTo(x + w, cy - bumpRadius);
    ctx.arc(x + w, cy, bumpRadius, -Math.PI / 2, Math.PI / 2, true);
  }
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  for (let i = bumpsX - 1; i >= 0; i--) {
    const cx = x + r + i * stepX + (stepX - r) / 2;
    ctx.lineTo(cx + bumpRadius, y + h);
    ctx.arc(cx, y + h, bumpRadius, 0, Math.PI, true);
  }
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  for (let i = bumpsY - 1; i >= 0; i--) {
    const cy = y + r + i * stepY + (stepY - r) / 2;
    ctx.lineTo(x, cy + bumpRadius);
    ctx.arc(x, cy, bumpRadius, Math.PI / 2, -Math.PI / 2, true);
  }
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
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