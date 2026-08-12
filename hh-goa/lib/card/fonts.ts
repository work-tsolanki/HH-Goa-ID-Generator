import path from "node:path";
import { existsSync } from "node:fs";
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
    const fullPath = path.join(FONT_DIR, file);
    if (!existsSync(fullPath)) {
      // eslint-disable-next-line no-console -- deliberate: a missing font
      // file otherwise fails silently and just renders as a fallback
      // system font with no error anywhere, which is exactly what's been
      // happening to "Space Grotesk" — this makes that failure visible.
      console.error(`[registerCardFonts] font file not found: ${fullPath} (family "${family}")`);
      continue;
    }
    try {
      const ok = GlobalFonts.registerFromPath(fullPath, family);
      if (!ok) {
        console.error(`[registerCardFonts] registerFromPath returned false for "${family}" at ${fullPath}`);
      }
    } catch (err) {
      console.error(`[registerCardFonts] failed to register "${family}" at ${fullPath}:`, err);
    }
  }

  // eslint-disable-next-line no-console -- one-time confirmation of what
  // actually made it into the font registry, cheap insurance against this
  // class of silent-fallback bug happening again with a different font.
  console.log("[registerCardFonts] registered families:", GlobalFonts.families.map((f) => f.family));

  registered = true;
}