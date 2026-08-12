import { Path2D, type SKRSContext2D } from "@napi-rs/canvas";
import { CARD_H, CARD_W } from "../theme";

const FROND =
  "M0 0L-2.7 -4.8L-6.0 -2.8L-8.7 -7.0L-12.0 -5.0L-14.7 -8.7L-18.0 -6.7L-20.7 -9.8L-24.0 -7.8L-26.7 -10.2L-30.0 -8.2L-32.7 -9.8L-36.0 -7.8L-38.7 -8.7L-42.0 -6.7L-44.7 -7.0L-48.0 -5.0L-48.0 0.4L-42.0 0.2L-36.0 0.0L-30.0 -0.0L-24.0 0.0L-18.0 0.2L-12.0 0.4L-6.0 0.7L0.0 1.0Z";
const TRUNK = "M-1.6 2C2.6 13.6 3.6 25.2 2.0 34L6.8 34C5.6 25.2 4.6 13.6 1.6 2Z";
const TRUNK_HIGHLIGHT = "M0.3 3.4C3.8 13.6 4.8 25.2 5.0 33";

const FROND_ANGLES: Array<[number, string]> = [
  [-44, "#2E8B57"],
  [-12, "#1B6440"],
  [22, "#2E8B57"],
  [58, "#1B6440"],
];
const FROND_ANGLES_MIRRORED: Array<[number, string]> = [
  [-44, "#1B6440"],
  [-12, "#2E8B57"],
  [22, "#1B6440"],
  [58, "#2E8B57"],
];

function drawPalm(ctx: SKRSContext2D, cx: number, cy: number, scale: number, mirror: boolean, opacity: number) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(cx, cy);
  ctx.scale(mirror ? -scale : scale, scale);
  ctx.lineJoin = "round";

  ctx.fillStyle = "#F3E7CE";
  ctx.fill(new Path2D(TRUNK));
  ctx.strokeStyle = "#E7B33C";
  ctx.lineWidth = 0.85;
  ctx.stroke(new Path2D(TRUNK_HIGHLIGHT));

  const frondPath = new Path2D(FROND);
  for (const [angle, color] of FROND_ANGLES) {
    ctx.save();
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = color;
    ctx.fill(frondPath);
    ctx.restore();
  }
  for (const [angle, color] of FROND_ANGLES_MIRRORED) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = color;
    ctx.fill(frondPath);
    ctx.restore();
  }

  ctx.fillStyle = "#E7B33C";
  ctx.beginPath();
  ctx.arc(-2.4, 3, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2.6, 4.2, 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * The two palm-tree silhouettes that sit low in the body's right margin,
 * behind the journey stepper and QR row — ported at the comp's own
 * transform math (10x viewBox scale, vertically centered in the body).
 */
export function drawGroundPalms(ctx: SKRSContext2D, headerH: number) {
  const bodyH = CARD_H - headerH;
  const viewScale = CARD_W / 130;
  const offsetY = headerH + (bodyH - 54 * viewScale) / 2;

  drawPalm(ctx, 130 * viewScale, offsetY + 41 * viewScale, 0.17 * viewScale, false, 0.6);
  drawPalm(ctx, 121 * viewScale, offsetY + 36 * viewScale, 0.21 * viewScale, true, 1);
}

/**
 * The faint scalloped grass hedge + sand strip that runs along the body's
 * "fold line" in the comp, plus its tiny ambient marks (three bird
 * squiggles, a paper flag, a beach umbrella, a standing shorebird). This
 * whole layer sits at the comp's outer opacity of .34 and was missing from
 * the port — only the two big palm trees made it over. Coordinates are
 * lifted verbatim from the comp's 130x54 viewBox group and mapped through
 * the same viewScale/offsetY used by drawGroundPalms so everything lines
 * up with the palms and the journey stepper above it.
 */
export function drawGroundStrip(ctx: SKRSContext2D, headerH: number) {
  const bodyH = CARD_H - headerH;
  const viewScale = CARD_W / 130;
  const offsetY = headerH + (bodyH - 54 * viewScale) / 2;

  ctx.save();
  ctx.globalAlpha = 0.34;
  ctx.translate(0, offsetY);
  ctx.scale(viewScale, viewScale);
  ctx.lineJoin = "round";

  // Scalloped grass hedge.
  ctx.save();
  ctx.globalAlpha = 0.34 * 0.55;
  ctx.fillStyle = "#2E8B57";
  ctx.fill(
    new Path2D(
      "M0 37.4c9 0 9 1.5 18 1.5s9-1.6 18-1.6 9 1.6 18 1.6 9-1.5 18-1.5 9 1.5 18 1.5 9-1.6 18-1.6 9 1.6 18 1.6V45H0z",
    ),
  );
  ctx.restore();

  // Sand strip beneath the hedge.
  ctx.save();
  ctx.globalAlpha = 0.34 * 0.7;
  ctx.fillStyle = "#E8DCC0";
  ctx.fill(new Path2D("M0 45h130v2.2H0z"));
  ctx.restore();

  // Three bird-squiggle marks.
  ctx.save();
  ctx.strokeStyle = "#F3E7CE";
  ctx.lineWidth = 0.42;
  ctx.lineCap = "round";
  ctx.stroke(new Path2D("M8 41.2c1.6-1 3.2-1 4.8 0 1.6 1 3.2 1 4.8 0"));
  ctx.stroke(new Path2D("M96 42.6c1.6-1 3.2-1 4.8 0 1.6 1 3.2 1 4.8 0"));
  ctx.stroke(new Path2D("M52 40.4c1.6-1 3.2-1 4.8 0 1.6 1 3.2 1 4.8 0"));
  ctx.restore();

  // Small paper flag.
  ctx.save();
  ctx.strokeStyle = "#0A2E20";
  ctx.lineWidth = 0.38;
  ctx.fillStyle = "#F3E7CE";
  ctx.fill(new Path2D("M24 39.6h11l-1.6 2.2H25.6z"));
  ctx.stroke(new Path2D("M24 39.6h11l-1.6 2.2H25.6z"));
  ctx.fillStyle = "#2E8B57";
  ctx.fill(new Path2D("M27 39.6v-1.7h4.6v1.7z"));
  ctx.stroke(new Path2D("M27 39.6v-1.7h4.6v1.7z"));
  ctx.restore();

  // Tiny beach umbrella.
  ctx.save();
  ctx.strokeStyle = "#0A2E20";
  ctx.lineWidth = 0.38;
  ctx.fillStyle = "#1B6440";
  ctx.fill(new Path2D("M72 46.6h5.4l3.2 2.6h-5.4z"));
  ctx.stroke(new Path2D("M72 46.6h5.4l3.2 2.6h-5.4z"));
  ctx.fill(new Path2D("M79.4 46.6h5.4l3.2 2.6h-5.4z"));
  ctx.stroke(new Path2D("M79.4 46.6h5.4l3.2 2.6h-5.4z"));
  ctx.fillStyle = "#E7B33C";
  ctx.fill(new Path2D("M74.6 44.6c0-2.4 2.2-4.2 5-4.2s5 1.8 5 4.2z"));
  ctx.stroke(new Path2D("M74.6 44.6c0-2.4 2.2-4.2 5-4.2s5 1.8 5 4.2z"));
  ctx.beginPath();
  ctx.moveTo(79.6, 40.4);
  ctx.lineTo(79.6, 46.8);
  ctx.stroke();
  ctx.fillStyle = "#F3E7CE";
  ctx.fill(new Path2D("M77 44.6c0-2.4 1.2-4.2 2.6-4.2s2.6 1.8 2.6 4.2z"));
  ctx.stroke(new Path2D("M77 44.6c0-2.4 1.2-4.2 2.6-4.2s2.6 1.8 2.6 4.2z"));
  ctx.restore();

  // Standing shorebird.
  ctx.save();
  ctx.fillStyle = "#1B6440";
  ctx.strokeStyle = "#0A2E20";
  ctx.lineWidth = 0.3;
  ctx.beginPath();
  ctx.arc(45, 42.6, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fill(new Path2D("M44.4 43.6h1.4l.5 2.4-.9.3-.6-1.6-.8 1.9-.9-.3z"));
  ctx.stroke(new Path2D("M44.4 43.6h1.4l.5 2.4-.9.3-.6-1.6-.8 1.9-.9-.3z"));
  ctx.restore();

  ctx.restore();
}