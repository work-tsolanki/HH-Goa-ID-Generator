import { loadImage, type SKRSContext2D } from "@napi-rs/canvas";
import bwipjs from "bwip-js/node";
import QRCode from "qrcode";
import { COLORS, FONT_FAMILY } from "../theme";
import { drawDashDivider, fitText, roundRectPath } from "../utils";

type ProcRow = { name: string; label: string };

const PROCS: ProcRow[] = [
  { name: "coconut.exe", label: "RUNNING" },
  { name: "vscode.exe", label: "RUNNING" },
  { name: "lofi-beats.mp3", label: "LOOPING" },
];

function drawPanel(ctx: SKRSContext2D, x: number, y: number, w: number, h: number, label: string) {
  ctx.save();
  ctx.fillStyle = COLORS.panel;
  roundRectPath(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.strokeStyle = COLORS.hairline;
  ctx.lineWidth = 2;
  roundRectPath(ctx, x, y, w, h, 10);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = COLORS.amber;
  ctx.font = `600 15px ${FONT_FAMILY.monoSemiBold}`;
  ctx.fillText(`$ ${label}`, x + 18, y + 30);
  ctx.restore();
}

export async function drawFooter(
  ctx: SKRSContext2D,
  opts: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    builderCode: string;
    shareUrl: string;
  },
) {
  const { top, bottom, left, right, builderCode, shareUrl } = opts;
  const gap = 24;
  const colW = (right - left - gap * 2) / 3;
  const h = bottom - top;
  const col1X = left;
  const col2X = left + colW + gap;
  const col3X = left + (colW + gap) * 2;

  // Column 1: QR
  drawPanel(ctx, col1X, top, colW, h, "scan --qr");
  const qrSize = Math.min(colW - 48, h - 84);
  const qrBuffer = await QRCode.toBuffer(shareUrl, {
    type: "png",
    margin: 0,
    width: Math.round(qrSize),
    color: { dark: "#0b0d0cff", light: "#f4f1eaff" },
  });
  const qrImg = await loadImage(qrBuffer);
  const qrX = col1X + (colW - qrSize) / 2;
  const qrY = top + 46;
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.textDim;
  ctx.font = `13px ${FONT_FAMILY.monoRegular}`;
  ctx.fillText("-> build your own", col1X + colW / 2, top + h - 16);
  ctx.restore();

  // Column 2: process list
  drawPanel(ctx, col2X, top, colW, h, "ps --beach");
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  let rowY = top + 62;
  for (const proc of PROCS) {
    ctx.fillStyle = COLORS.textFaint;
    ctx.font = `13px ${FONT_FAMILY.monoRegular}`;
    ctx.fillText("PROC", col2X + 18, rowY);
    ctx.fillStyle = COLORS.textBright;
    ctx.font = `600 16px ${FONT_FAMILY.monoSemiBold}`;
    ctx.fillText(proc.name, col2X + 66, rowY);
    ctx.fillStyle = COLORS.green;
    ctx.font = `12px ${FONT_FAMILY.monoRegular}`;
    ctx.textAlign = "right";
    ctx.fillText(proc.label, col2X + colW - 16, rowY);
    ctx.textAlign = "left";
    rowY += 34;
  }
  ctx.restore();

  // Column 3: builder ID + barcode
  drawPanel(ctx, col3X, top, colW, h, "id --show");
  ctx.save();
  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.textDim;
  ctx.font = `13px ${FONT_FAMILY.monoRegular}`;
  ctx.fillText("PID", col3X + 18, top + 60);
  const idSize = fitText(ctx, `#${builderCode}`, colW - 36, FONT_FAMILY.monoBold, 20, 13);
  ctx.fillStyle = COLORS.amber;
  ctx.font = `700 ${idSize}px ${FONT_FAMILY.monoBold}`;
  ctx.fillText(`#${builderCode}`, col3X + 18, top + 86);
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
  const bw = colW - 36;
  const bh = (bw / barcodeImg.width) * barcodeImg.height;
  ctx.drawImage(barcodeImg, col3X + 18, top + h - bh - 20, bw, bh);
}

/** Closing shell prompt line — a blinking cursor and the event hashtag, like a session left open. */
export function drawClosingPrompt(ctx: SKRSContext2D, x: number, y: number, right: number) {
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = COLORS.textDim;
  ctx.font = `600 22px ${FONT_FAMILY.monoSemiBold}`;
  ctx.fillText("$", x, y);

  ctx.fillStyle = COLORS.amber;
  roundRectPath(ctx, x + 20, y - 20, 14, 26, 2);
  ctx.fill();

  ctx.textAlign = "right";
  ctx.fillStyle = COLORS.amber;
  ctx.font = `700 24px ${FONT_FAMILY.monoBold}`;
  ctx.fillText("echo #FRAMEINGOA", right, y);
  ctx.restore();
}

export function drawDivider(ctx: SKRSContext2D, x: number, y: number, w: number) {
  drawDashDivider(ctx, x, y, w, { color: COLORS.hairline, width: 2, dash: [10, 8] });
}
