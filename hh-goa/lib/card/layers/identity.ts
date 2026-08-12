import type { SKRSContext2D } from "@napi-rs/canvas";
import { CARD_H, COLORS, FONT_FAMILY } from "../theme";
import { fitText } from "../utils";

/** The builder's name — largest element on the pass body, set in the black display face. */
export function drawName(ctx: SKRSContext2D, x: number, y: number, name: string, maxWidth: number): number {
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const upper = name.toUpperCase();
  const size = fitText(ctx, upper, maxWidth, FONT_FAMILY.display, 96, 40);
  ctx.font = `${size}px ${FONT_FAMILY.display}`;
  ctx.fillStyle = COLORS.ink;
  ctx.fillText(upper, x, y);
  ctx.restore();
  return y;
}

/** The stack/role line directly under the name — the one place hot pink appears on the card. */
export function drawStackLine(ctx: SKRSContext2D, x: number, y: number, stack: string): number {
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 27px ${FONT_FAMILY.body}`;
  ctx.fillStyle = COLORS.pink;
  ctx.fillText(stack, x, y);
  ctx.restore();
  return y;
}

/** The two-column BUILDER CLASS / CURRENTLY SHIPPING grid. */
export function drawIdentityGrid(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  builderClass: string,
  tagline: string,
): number {
  const colGap = 39;
  const colW = (width - colGap) / 2;

  const cells: Array<[string, string, number]> = [
    ["BUILDER CLASS", builderClass, x],
    ["CURRENTLY SHIPPING", tagline, x + colW + colGap],
  ];

  let maxBottom = y;
  for (const [label, value, cx] of cells) {
    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `500 17px ${FONT_FAMILY.body}`;
    ctx.fillStyle = "rgba(11,51,37,.55)";
    ctx.fillText(label, cx, y);

    const valueY = y + 33;
    const size = fitText(ctx, value, colW, FONT_FAMILY.body, 30, 18);
    ctx.font = `700 ${size}px ${FONT_FAMILY.body}`;
    ctx.fillStyle = COLORS.ink;
    ctx.fillText(value, cx, valueY);
    ctx.restore();

    maxBottom = Math.max(maxBottom, valueY);
  }

  return maxBottom;
}

/** The rotated "TICKET NO." stub label + perforation line running up the pass's left margin. */
export function drawTicketStub(ctx: SKRSContext2D, bodyTop: number, builderId: string) {
  ctx.save();
  ctx.strokeStyle = "rgba(11,51,37,.24)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(46, bodyTop + 20);
  ctx.lineTo(46, CARD_H - 91);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(20, CARD_H - 124);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `500 16px ${FONT_FAMILY.body}`;
  ctx.fillStyle = "rgba(11,51,37,.42)";
  ctx.fillText(`TICKET NO. ${builderId}`, 0, 0);
  ctx.restore();
}

const JOURNEY_STOPS: Array<{ label: string; date: string; fill: string }> = [
  { label: "LAND", date: "28 OCT", fill: COLORS.gold },
  { label: "BUILD", date: "29 OCT", fill: COLORS.gold },
  { label: "SHIP", date: "30 OCT", fill: COLORS.pink },
  { label: "LAUNCH", date: "31 OCT", fill: COLORS.ink },
];

/** The LAND → BUILD → SHIP → LAUNCH stepper — this comp's signature timeline motif. */
export function drawBuilderJourney(ctx: SKRSContext2D, x: number, y: number, width: number): number {
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `500 16px ${FONT_FAMILY.body}`;
  ctx.fillStyle = "rgba(11,51,37,.55)";
  ctx.fillText("BUILDER JOURNEY", x, y);
  ctx.restore();

  const rowTop = y + 23;
  const journeyW = width - 117;
  const colW = journeyW / 4;
  const dotY = rowTop + 10;
  const dotR = 10;

  ctx.save();
  ctx.strokeStyle = "rgba(11,51,37,.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + journeyW * 0.09, dotY);
  ctx.lineTo(x + journeyW * 0.84, dotY);
  ctx.stroke();
  ctx.restore();

  let bottom = dotY;
  JOURNEY_STOPS.forEach((stop, i) => {
    const cx = x + colW * (i + 0.5);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, dotY, dotR, 0, Math.PI * 2);
    ctx.fillStyle = stop.fill;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = COLORS.ink;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.font = `700 18px ${FONT_FAMILY.body}`;
    ctx.fillStyle = COLORS.ink;
    const labelY = dotY + dotR + 22;
    ctx.fillText(stop.label, cx, labelY);

    ctx.font = `700 14px ${FONT_FAMILY.body}`;
    ctx.fillStyle = "rgba(11,51,37,.5)";
    const dateY = labelY + 20;
    ctx.fillText(stop.date, cx, dateY);
    ctx.restore();

    bottom = Math.max(bottom, dateY);
  });

  return bottom;
}
