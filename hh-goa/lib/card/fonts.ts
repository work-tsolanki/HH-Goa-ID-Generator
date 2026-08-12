import path from "node:path";
import { GlobalFonts } from "@napi-rs/canvas";
import { FONT_FAMILY } from "./theme";

let registered = false;

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

export function registerCardFonts() {
  if (registered) return;

  const files: Array<[string, string]> = [
    ["ArchivoBlack-Regular.ttf", FONT_FAMILY.display],
    ["NotoSerifDevanagari-Variable.ttf", FONT_FAMILY.devanagari],
    ["SpaceGrotesk-Variable.ttf", FONT_FAMILY.body],
  ];

  for (const [file, family] of files) {
    GlobalFonts.registerFromPath(path.join(FONT_DIR, file), family);
  }

  registered = true;
}
