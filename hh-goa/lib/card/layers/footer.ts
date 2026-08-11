import { loadImage, type SKRSContext2D } from "@napi-rs/canvas";
import bwipjs from "bwip-js/node";
import QRCode from "qrcode";
import { COLORS, FONT_FAMILY } from "../theme";
import { drawRule, fitText } from "../utils";

const BEACH_BAG = ["COCONUT", "VS CODE", "LO-FI BEATS"];

export function drawBeachBagRow(ctx: SKRSContext2D, cx: number, y: number) {
  ctx.save();
  ctx.font = `600 15px ${FONT_FAMILY.poppinsSemiBold}`;
  const dotGap = 22;
  const widths = BEACH_BAG.map((w) => ctx.measureText(w).width);
  const total = widths.reduce((a, b) => a + b, 0) + dotGap * (BEACH_BAG.length - 1);

  let x = cx - total / 2;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  BEACH_BAG.forEach((label, i) => {
    ctx.fillStyle = COLORS.textDim;
    ctx.fillText(label, x, y);
    x += widths[i];
    if (i < BEACH_BAG.length - 1) {
      x += dotGap / 2;
      ctx.save();
      ctx.fillStyle = COLORS.goldDim;
      ctx.beginPath();
      ctx.arc(x, y - 5, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      x += dotGap / 2;
    }
  });
  ctx.restore();
}

export async function drawFooter(
  ctx: SKRSContext2D,
  opts: { top: number; left: number; right: number; builderCode: string; shareUrl: string },
) {
  const { top, left, right, builderCode, shareUrl } = opts;
  const colGap = 48;
  const colW = (right - left - colGap) / 2;
  const qrX = left;
  const idX = left + colW + colGap;

  const qrSize = 128;
  const qrBuffer = await QRCode.toBuffer(shareUrl, {
    type: "png",
    margin: 0,
    width: qrSize,
    color: { dark: "#0d3b28ff", light: "#f4f1eaff" },
  });
  const qrImg = await loadImage(qrBuffer);
  ctx.drawImage(qrImg, qrX, top, qrSize, qrSize);
  ctx.save();
  ctx.textAlign = "left";
  ctx.font = `600 14px ${FONT_FAMILY.poppinsSemiBold}`;
  ctx.fillStyle = COLORS.textDim;
  ctx.fillText("SCAN TO BUILD YOURS", qrX, top + qrSize + 28);
  ctx.restore();

  ctx.save();
  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.textDim;
  ctx.font = `600 14px ${FONT_FAMILY.poppinsSemiBold}`;
  ctx.fillText("BUILDER ID", idX, top + 20);
  const idSize = fitText(ctx, `#${builderCode}`, colW, FONT_FAMILY.poppinsBold, 24, 15);
  ctx.fillStyle = COLORS.gold;
  ctx.font = `700 ${idSize}px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillText(`#${builderCode}`, idX, top + 52);
  ctx.restore();

  const barcodeBuffer = await bwipjs.toBuffer({
    bcid: "code128",
    text: builderCode.replace(/[^A-Za-z0-9-]/g, ""),
    scale: 2,
    height: 9,
    includetext: false,
    backgroundcolor: "F4F1EA",
    paddingwidth: 2,
    paddingheight: 2,
  });
  const barcodeImg = await loadImage(barcodeBuffer);
  const bw = colW;
  const bh = (bw / barcodeImg.width) * barcodeImg.height;
  ctx.drawImage(barcodeImg, idX, top + 72, bw, bh);
}

export function drawClosingRule(ctx: SKRSContext2D, x: number, y: number, w: number) {
  drawRule(ctx, x, y, w, COLORS.goldDim);
}

export function drawHashtag(ctx: SKRSContext2D, cx: number, y: number) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = `700 24px ${FONT_FAMILY.poppinsBold}`;
  ctx.fillStyle = COLORS.gold;
  ctx.fillText("#FRAMEINGOA", cx, y);
  ctx.restore();
}
