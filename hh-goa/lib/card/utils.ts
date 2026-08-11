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

/** Fill + stroke text together so the glyphs read heavier/blacker, like inked lettering. */
export function boldText(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  opts: { fill: string; stroke?: string; strokeWidth?: number } = { fill: "#000" },
) {
  ctx.save();
  ctx.fillStyle = opts.fill;
  if (opts.stroke && opts.strokeWidth) {
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeStyle = opts.stroke;
    ctx.lineWidth = opts.strokeWidth;
    ctx.strokeText(text, x, y);
  }
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function drawVerticalText(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  opts: { font: string; color: string; letterSpacing?: number; direction?: 1 | -1 },
) {
  const dir = opts.direction ?? 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((dir * Math.PI) / 2);
  ctx.font = opts.font;
  ctx.fillStyle = opts.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (opts.letterSpacing) {
    drawLetterSpaced(ctx, text, 0, 0, opts.letterSpacing);
  } else {
    ctx.fillText(text, 0, 0);
  }
  ctx.restore();
}

export function drawLetterSpaced(
  ctx: SKRSContext2D,
  text: string,
  cx: number,
  y: number,
  spacing: number,
) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
  let x = cx - total / 2;
  const prevAlign = ctx.textAlign;
  ctx.textAlign = "left";
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], x, y);
    x += widths[i] + spacing;
  }
  ctx.textAlign = prevAlign;
}

type ArcTextOpts = { font: string; color: string; letterSpacing?: number };

/** Draws text along the top of a circle, reading left-to-right, upright. */
export function drawArcTextTop(
  ctx: SKRSContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  opts: ArcTextOpts,
) {
  ctx.save();
  ctx.font = opts.font;
  ctx.fillStyle = opts.color;
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width + (opts.letterSpacing ?? 0));
  const totalAngle = widths.reduce((a, b) => a + b, 0) / radius;

  let angle = -totalAngle / 2;
  for (let i = 0; i < chars.length; i++) {
    const charAngle = widths[i] / radius;
    const mid = angle + charAngle / 2;
    const x = cx + radius * Math.sin(mid);
    const y = cy - radius * Math.cos(mid);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(mid);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
    angle += charAngle;
  }
  ctx.restore();
}

/** Draws text along the bottom of a circle, reading left-to-right, upright. */
export function drawArcTextBottom(
  ctx: SKRSContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  opts: ArcTextOpts,
) {
  ctx.save();
  ctx.font = opts.font;
  ctx.fillStyle = opts.color;
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width + (opts.letterSpacing ?? 0));
  const totalAngle = widths.reduce((a, b) => a + b, 0) / radius;

  // Bottom of the circle is angle = PI (measured clockwise from 12 o'clock).
  // Moving left-to-right along the bottom means DEcreasing the angle.
  let angle = Math.PI + totalAngle / 2;
  for (let i = 0; i < chars.length; i++) {
    const charAngle = widths[i] / radius;
    const mid = angle - charAngle / 2;
    const x = cx + radius * Math.sin(mid);
    const y = cy - radius * Math.cos(mid);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(mid - Math.PI);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
    angle -= charAngle;
  }
  ctx.restore();
}

export function drawDashedCircle(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  radius: number,
  opts: { color: string; width: number; dash: [number, number] },
) {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash(opts.dash);
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = opts.width;
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

export function drawSparkle(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  rotation = 0,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size * 0.18, -size * 0.18, size, 0);
  ctx.quadraticCurveTo(size * 0.18, size * 0.18, 0, size);
  ctx.quadraticCurveTo(-size * 0.18, size * 0.18, -size, 0);
  ctx.quadraticCurveTo(-size * 0.18, -size * 0.18, 0, -size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawBird(ctx: SKRSContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.18);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - size, cy);
  ctx.quadraticCurveTo(cx - size * 0.4, cy - size * 0.9, cx, cy);
  ctx.quadraticCurveTo(cx + size * 0.4, cy - size * 0.9, cx + size, cy);
  ctx.stroke();
  ctx.restore();
}

export function drawDotTexture(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { color: string; gap: number; radius: number },
) {
  ctx.save();
  ctx.fillStyle = opts.color;
  for (let py = y; py < y + h; py += opts.gap) {
    for (let px = x; px < x + w; px += opts.gap) {
      ctx.beginPath();
      ctx.arc(px, py, opts.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
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
