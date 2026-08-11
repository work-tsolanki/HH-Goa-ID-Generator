import type { SKRSContext2D } from "@napi-rs/canvas";
import { COLORS, FONT_FAMILY } from "../theme";
import { fitText } from "../utils";

export type PromptRowOptions = {
  prompt: string;
  response: string;
  responseColor?: string;
  maxWidth: number;
  promptSize?: number;
  responseSize?: number;
};

/**
 * A `$ command` / `> response` pair — the card's primary content device,
 * replacing the postcard world's pills and ribbons. Returns the y position
 * just below the drawn row, so callers can stack rows with a running cursor.
 */
export function drawPromptRow(ctx: SKRSContext2D, x: number, y: number, opts: PromptRowOptions): number {
  const promptSize = opts.promptSize ?? 22;
  const responseSize = opts.responseSize ?? 32;

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = COLORS.amber;
  ctx.font = `600 ${promptSize}px ${FONT_FAMILY.monoSemiBold}`;
  ctx.fillText(`$ ${opts.prompt}`, x, y);

  const responseY = y + promptSize + 10;
  const size = fitText(ctx, `> ${opts.response}`, opts.maxWidth, FONT_FAMILY.monoBold, responseSize, 18);
  ctx.fillStyle = opts.responseColor ?? COLORS.textBright;
  ctx.font = `700 ${size}px ${FONT_FAMILY.monoBold}`;
  ctx.fillText(`> ${opts.response}`, x, responseY);

  ctx.restore();
  return responseY;
}
