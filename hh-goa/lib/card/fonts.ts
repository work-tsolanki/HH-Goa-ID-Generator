import path from "node:path";
import { GlobalFonts } from "@napi-rs/canvas";
import { FONT_FAMILY } from "./theme";

let registered = false;

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

export function registerCardFonts() {
  if (registered) return;

  const files: Array<[string, string]> = [
    ["IBMPlexMono-Regular.ttf", FONT_FAMILY.monoRegular],
    ["IBMPlexMono-Medium.ttf", FONT_FAMILY.monoMedium],
    ["IBMPlexMono-SemiBold.ttf", FONT_FAMILY.monoSemiBold],
    ["IBMPlexMono-Bold.ttf", FONT_FAMILY.monoBold],
  ];

  for (const [file, family] of files) {
    GlobalFonts.registerFromPath(path.join(FONT_DIR, file), family);
  }

  registered = true;
}
