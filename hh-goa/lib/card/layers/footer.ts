import { loadImage, type SKRSContext2D } from "@napi-rs/canvas";
import bwipjs from "bwip-js/node";
import QRCode from "qrcode";
import { CARD_W, COLORS, FONT_FAMILY } from "../theme";
import { drawSparkle, fitText, roundRectPath } from "../utils";

type BeachBagItem = { icon: "coconut" | "code" | "headphones"; label: string };

const BEACH_BAG: BeachBagItem[] = [
  { icon: "coconut", label: "COCONUT" },
  { icon: "code", label: "VS CODE" },
  { icon: "headphones", label: "LO-FI BEATS" },
];

export async function drawFooter(
  ctx: SKRSContext2D,
  opts: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    builderClass: string;
    tagline: string;
    builderCode: string;
    name: string;
    shareUrl: string;
  },
) {
  const { top, bottom, left, right, builderClass, tagline, builderCode, name, shareUrl } = opts;
  const colW = (right - left) / 3;
  const col1X = left;
  const col2X = left + colW;
  const col3X = left + colW * 2;

  drawDivider(ctx, col2X, top, bottom);
  drawDivider(ctx, col3X, top, bottom);

  drawColumnHeader(ctx, col1X + colW / 2, top, "BUILDER CLASS");
  ctx.save();
  ctx.fillStyle = COLORS.pinkDark;
  ctx.textAlign = "center";
  const s1 = fitText(ctx, builderClass, colW - 20, FONT_FAMILY.poppinsBold, 26, 15);
  ctx.font = `800 ${s1}px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillText(builderClass, col1X + colW / 2, top + 46);
  ctx.restore();

  drawColumnHeader(ctx, col2X + colW / 2, top, "BEACH BAG");
  drawBeachBag(ctx, col2X + 10, top + 34);

  drawColumnHeader(ctx, col3X + colW / 2, top, "CURRENTLY SHIPPING");
  ctx.save();
  ctx.fillStyle = COLORS.pinkDark;
  ctx.textAlign = "center";
  const s3 = fitText(ctx, tagline, colW - 16, FONT_FAMILY.poppinsBold, 23, 13);
  ctx.font = `800 ${s3}px ${FONT_FAMILY.poppinsBold}`;
  wrapCenteredText(ctx, tagline, col3X + colW / 2, top + 42, colW - 16, s3 * 1.15);
  ctx.restore();

  const qrSize = 128;
  const qrBuffer = await QRCode.toBuffer(shareUrl, {
    type: "png",
    margin: 0,
    width: qrSize,
    color: { dark: "#163a2bff", light: "#00000000" },
  });
  const qrImg = await loadImage(qrBuffer);
  const qrX = col1X + 4;
  const qrY = bottom - qrSize - 6;
  ctx.save();
  ctx.fillStyle = COLORS.white;
  roundRectPath(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10);
  ctx.fill();
  ctx.strokeStyle = COLORS.green;
  ctx.lineWidth = 2;
  roundRectPath(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10);
  ctx.stroke();
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = COLORS.green;
  ctx.textAlign = "left";
  ctx.font = `600 13px ${FONT_FAMILY.poppinsSemiBold}`;
  ctx.fillText("SCAN TO BUILD YOUR OWN", qrX - 6, qrY + qrSize + 26);
  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.green;
  ctx.font = `600 14px ${FONT_FAMILY.poppinsSemiBold}`;
  ctx.fillText("BUILDER ID", col3X + colW / 2, bottom - 112);
  ctx.fillStyle = COLORS.pinkDark;
  const nameSize = fitText(ctx, name.toUpperCase(), colW - 16, FONT_FAMILY.poppinsBold, 19, 12);
  ctx.font = `800 ${nameSize}px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillText(name.toUpperCase(), col3X + colW / 2, bottom - 90);
  ctx.fillStyle = COLORS.green;
  ctx.font = `700 16px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillText(`#${builderCode}`, col3X + colW / 2, bottom - 68);
  ctx.restore();

  const barcodeBuffer = await bwipjs.toBuffer({
    bcid: "code128",
    text: builderCode.replace(/[^A-Za-z0-9-]/g, ""),
    scale: 2,
    height: 10,
    includetext: false,
    backgroundcolor: "FFFFFF",
    paddingwidth: 2,
    paddingheight: 2,
  });
  const barcodeImg = await loadImage(barcodeBuffer);
  const bw = Math.min(colW - 10, 220);
  const bh = (bw / barcodeImg.width) * barcodeImg.height;
  const bx = col3X + colW / 2 - bw / 2;
  const by = bottom - bh - 4;
  ctx.drawImage(barcodeImg, bx, by, bw, bh);
}

function drawDivider(ctx: SKRSContext2D, x: number, top: number, bottom: number) {
  ctx.save();
  ctx.strokeStyle = COLORS.greenLine;
  ctx.lineWidth = 2;
  ctx.setLineDash([2, 6]);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, bottom);
  ctx.stroke();
  ctx.restore();
}

function drawColumnHeader(ctx: SKRSContext2D, cx: number, top: number, label: string) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.green;
  ctx.font = `700 15px ${FONT_FAMILY.poppinsBold}`;
  const w = ctx.measureText(label).width;
  ctx.fillText(label, cx, top);
  ctx.restore();
  drawSparkle(ctx, cx - w / 2 - 14, top - 4, 6, COLORS.gold, 0.2);
  drawSparkle(ctx, cx + w / 2 + 14, top - 4, 6, COLORS.gold, -0.2);
}

function drawBeachBag(ctx: SKRSContext2D, x: number, y: number) {
  const rowH = 34;
  ctx.save();
  ctx.textAlign = "left";
  BEACH_BAG.forEach((item, i) => {
    const rowY = y + i * rowH;
    drawBagIcon(ctx, x + 14, rowY + 10, item.icon);
    ctx.fillStyle = COLORS.green;
    ctx.font = `600 16px ${FONT_FAMILY.poppinsSemiBold}`;
    ctx.textBaseline = "middle";
    ctx.fillText(item.label, x + 34, rowY + 11);
  });
  ctx.restore();
}

function drawBagIcon(ctx: SKRSContext2D, cx: number, cy: number, icon: BeachBagItem["icon"]) {
  ctx.save();
  ctx.translate(cx, cy);
  if (icon === "coconut") {
    ctx.fillStyle = COLORS.brownDark;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.green;
    ctx.beginPath();
    ctx.ellipse(-4, -10, 8, 4, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -10, 8, 4, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon === "code") {
    ctx.fillStyle = COLORS.greenLine;
    roundRectPath(ctx, -11, -8, 22, 16, 3);
    ctx.fill();
    ctx.fillStyle = COLORS.white;
    ctx.font = `700 10px ${FONT_FAMILY.poppinsBold}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("</>", 0, 1);
  } else {
    ctx.strokeStyle = COLORS.pinkDark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -2, 9, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = COLORS.pinkDark;
    roundRectPath(ctx, -11, -3, 5, 9, 2);
    ctx.fill();
    roundRectPath(ctx, 6, -3, 5, 9, 2);
    ctx.fill();
  }
  ctx.restore();
}

function wrapCenteredText(
  ctx: SKRSContext2D,
  text: string,
  cx: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, cx, startY + i * lineHeight);
  });
}

export function drawBottomRibbon(ctx: SKRSContext2D, cy: number, text: string) {
  const w = 340;
  const h = 66;
  const cx = CARD_W / 2;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const point = 22;

  ctx.save();
  ctx.fillStyle = COLORS.pinkDark;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w + point, y + h / 2);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x - point, y + h / 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.pink;
  const inset = 6;
  ctx.beginPath();
  ctx.moveTo(x + inset, y + inset);
  ctx.lineTo(x + w - inset, y + inset);
  ctx.lineTo(x + w + point - inset - 2, y + h / 2);
  ctx.lineTo(x + w - inset, y + h - inset);
  ctx.lineTo(x + inset, y + h - inset);
  ctx.lineTo(x - point + inset + 2, y + h / 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.white;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 28px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillText(text, cx, y + h / 2 + 2);
  ctx.restore();
}
