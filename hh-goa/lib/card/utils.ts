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

/** Faint horizontal CRT scanlines across a region — the terminal world's texture, in place of the postcard world's dot grid. */
export function drawScanlines(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { color: string; gap: number; opacity: number },
) {
  ctx.save();
  ctx.globalAlpha = opts.opacity;
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = 1;
  for (let py = y; py < y + h; py += opts.gap) {
    ctx.beginPath();
    ctx.moveTo(x, py);
    ctx.lineTo(x + w, py);
    ctx.stroke();
  }
  ctx.restore();
}

/** A dashed horizontal rule, terminal `---` divider style. */
export function drawDashDivider(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  opts: { color: string; width?: number; dash?: [number, number] },
) {
  ctx.save();
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = opts.width ?? 2;
  ctx.setLineDash(opts.dash ?? [10, 8]);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

/** macOS-terminal-style traffic-light dots for the title bar. */
export function drawTrafficLights(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  opts: { radius: number; gap: number; colors: [string, string, string] },
) {
  ctx.save();
  opts.colors.forEach((color, i) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x + i * opts.gap, y, opts.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}
