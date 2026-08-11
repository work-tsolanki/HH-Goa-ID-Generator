import type { Metadata, Viewport } from "next";
import { Poppins, Yatra_One, Zilla_Slab } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const zillaSlab = Zilla_Slab({
  variable: "--font-zilla-slab",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const yatraOne = Yatra_One({
  variable: "--font-yatra-one",
  subsets: ["latin", "devanagari"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "HH Goa 2026 Frame Generator",
  description:
    "Build your Hacker House Goa 2026 postcard badge in seconds. Upload a photo, add your name and stack, and share your #FrameInGoa card.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#163a2b",
};

// React strips {/* JSX comments */} entirely — they never reach the DOM.
// This renders a genuine HTML comment so the direction contract survives
// the production build and can be grepped from the built output.
function DirectionContract() {
  const contract = `
    THESIS: The whole journey is the postcard, not just the export —
    refuses the generic-SaaS-wrapper-around-a-nice-output default.
    OWN-WORLD: Forest-green ground with a gold dot-matrix burst; oversized
    gold slab-serif wordmark pierced by a hand-lettered magenta Devanagari
    tag; cream dotted paper for task screens; dashed-border postage-stamp
    buttons; scalloped rickrack rings.
    STORY: A builder sees this is made for Hacker House Goa specifically,
    uploads a photo, types two lines, and leaves with a card worth posting.
    FIRST VIEWPORT: Full-bleed dark-green hero, dot-matrix burst centered,
    "HACKER HOUSE" wordmark at display scale with गोवा tag overlapping
    mid-word, translucent date/location bar beneath, one CTA stamp-button
    top-right.
    FORM: Pinned brief — https://hhgoa-own-id-card.vercel.app/, committed
    in its native grammar; no concept-seed roll (a brief-pinned direction
    beats the roll). Execution: code-led, no image-generation tool in this
    session.
    FINISH: unreviewed and undocumented is unfinished; this build ends
    with the finish review, the verdict, and DESIGN.md
  `.trim();

  return (
    <div
      style={{ display: "none" }}
      dangerouslySetInnerHTML={{ __html: `<!-- ${contract} -->` }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${zillaSlab.variable} ${yatraOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-foreground font-sans">
        <DirectionContract />
        {children}
      </body>
    </html>
  );
}
