import type { Metadata, Viewport } from "next";
import { Abril_Fatface, Poppins, Yatra_One } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const abrilFatface = Abril_Fatface({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const yatraOne = Yatra_One({
  variable: "--font-yatra-one",
  subsets: ["latin", "devanagari"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "HH Goa 2026 Frame Generator",
  description:
    "Build your Hacker House Goa 2026 builder pass in seconds. Upload a photo, add your name and stack, and share your #FrameInGoa card.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d3b28",
};

// React strips {/* JSX comments */} entirely — they never reach the DOM.
// This renders a genuine HTML comment so the direction contract survives
// the production build and can be grepped from the built output.
function DirectionContract() {
  const contract = `
    THESIS: A hacker house on a beach still needs to feel like a beach —
    one calm, generously-spaced page with a single rich illustrated
    moment, not a wall of UI chrome competing with it.
    OWN-WORLD: hhgoa.com's own palette (deep forest green, one gold
    accent, hot pink reserved for गोवा only) applied with Swiss/minimalist
    discipline: grid-based, high-contrast, one accent color, no
    decorative shadows or borders on UI chrome. The illustration is the
    one place detail is allowed — an authored beach scene with a
    developer coding at a shack counter, laptop screen included.
    STORY: A visitor recognizes the event's own colors immediately, reads
    a two-line pitch in a generous white-space layout, and either scrolls
    into the illustrated scene or clicks straight through to build a
    pass.
    FIRST VIEWPORT: Deep-green ground, minimal nav (wordmark + two quiet
    links), a centered serif headline with गोवा in pink, one gold CTA —
    the beach-and-coding illustration begins directly below, full width.
    FORM: Explicitly pinned to hhgoa.com's palette and UI per the user's
    direct instruction, combined with the ui-ux-pro-max skill's
    Minimalism & Swiss Style rules for structure (grid, whitespace, one
    accent, no gratuitous decoration). Execution: code-led, no
    image-generation tool in this session; the hero illustration is
    hand-authored SVG.
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
      className={`${poppins.variable} ${abrilFatface.variable} ${yatraOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-green text-foreground font-sans">
        <DirectionContract />
        {children}
      </body>
    </html>
  );
}
