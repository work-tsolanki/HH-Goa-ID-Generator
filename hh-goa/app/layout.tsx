import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Grotesk, Noto_Serif_Devanagari } from "next/font/google";
import Background from "@/components/Background";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: "HH Goa 2026 Frame Generator",
  description:
    "Build your Hacker House Goa 2026 builder pass in seconds. Upload a photo, add your name and stack, and share your #FrameInGoa card.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff3d6",
};

// React strips {/* JSX comments */} entirely — they never reach the DOM.
// This renders a genuine HTML comment so the direction contract survives
// the production build and can be grepped from the built output.
function DirectionContract() {
  const contract = `
    THESIS: A hacker residency needs a pass you'd actually want to flash —
    a physical, laminated, stamped artifact, not another soft SaaS card
    with a gradient and a rounded corner.
    OWN-WORLD: neubrutalist festival-pass system pinned by the user's own
    approved comp (HH Goa 2026 Frame Generator v3.dc.html), recolored with
    hhgoa.com's own verified palette (--background/--primary #0b6839,
    --secondary #fee101, --accent #ff0080, read live from the official
    site's CSS custom properties): cream paper ground (#FFF3D6/#FBF1DC),
    3px ink borders, hard offset box-shadows that press on hover/active,
    Archivo Black display type, Space Grotesk body/label type, गोवा set in
    Noto Serif Devanagari pink, a gold CTA, a forest-green brand block,
    and a dot-grid + diagonal-band paper texture behind everything.
    STORY: A visitor lands on a loud, confident pass-generator storefront,
    recognizes it as a real credential (not a toy), drops a photo, crops
    it, names their stack, and watches their pass build itself in the
    background as they type, so "Generate" just reveals it.
    FIRST VIEWPORT: cream ground, dot-grid + diagonal gold band behind a
    bordered "HACKER HOUSE गोवा 26" brand button and a CHECK HYPE / CREATE
    lockup, a giant Archivo Black headline ("BUILD IN GOA, SHIP FROM
    PARADISE") with PARADISE in pink-stroked ink, a gold "CREATE MY PASS"
    button with a hard shadow, and the illustrated hero scene bleeding
    off the bottom edge.
    FORM: user-and-brief-pinned direction — the .dc.html comp supplied
    through claude_design MCP is the executable spec; per new-work.md
    section 3, "a user- or brief-pinned direction beats the roll,
    always," so the concept-seed dice round was skipped and this comp is
    the law the build reproduces.
    FINISH: unreviewed and undocumented is unfinished; this build ends
    with the finish review, the verdict, and DESIGN.md
  `.trim();

  return (
    <div style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: `<!-- ${contract} -->` }} />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${archivoBlack.variable} ${notoSerifDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper-deep text-ink font-sans">
        <DirectionContract />
        <Background />
        {children}
      </body>
    </html>
  );
}
