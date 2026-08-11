import path from "node:path";
import { GlobalFonts } from "@napi-rs/canvas";
import { FONT_FAMILY } from "./theme";

let registered = false;

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

export function registerCardFonts() {
  if (registered) return;

  const files: Array<[string, string]> = [
    ["Poppins-Black.ttf", FONT_FAMILY.poppinsBlack],
    ["Poppins-Bold.ttf", FONT_FAMILY.poppinsBold],
    ["Poppins-SemiBold.ttf", FONT_FAMILY.poppinsSemiBold],
    ["Poppins-Medium.ttf", FONT_FAMILY.poppinsMedium],
    ["Poppins-Regular.ttf", FONT_FAMILY.poppinsRegular],
    ["ZillaSlab-Bold.ttf", FONT_FAMILY.zillaSlabBold],
    ["YatraOne-Regular.ttf", FONT_FAMILY.yatraOne],
  ];

  for (const [file, family] of files) {
    GlobalFonts.registerFromPath(path.join(FONT_DIR, file), family);
  }

  registered = true;
}
