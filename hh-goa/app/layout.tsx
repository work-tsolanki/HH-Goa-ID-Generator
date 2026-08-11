import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HH Goa 2026 Frame Generator",
  description:
    "Build your Hacker House Goa 2026 builder pass in seconds. Upload a photo, add your name and stack, and share your #FrameInGoa terminal card.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d0c",
};

// React strips {/* JSX comments */} entirely — they never reach the DOM.
// This renders a genuine HTML comment so the direction contract survives
// the production build and can be grepped from the built output.
function DirectionContract() {
  const contract = `
    THESIS: A hacker house's own homepage should look like a terminal
    session, not a tourism postcard — refuses the green/gold/palm-tree
    illustrated-postcard default every other HH Goa 2026 submission we
    looked at converged on.
    OWN-WORLD: Near-black CRT ground with faint scanlines; one amber
    accent (prompts, highlights) plus a muted terminal green for
    success/status text; IBM Plex Mono is the only typeface anywhere,
    weight carries all hierarchy; a macOS-style title bar (traffic-light
    dots + filename) frames every screen as an open terminal window;
    primary actions are bracket buttons, "[ RUN ]", not pills.
    STORY: A builder opens what looks like an SSH session into Goa,
    watches a two-line boot sequence, uploads a photo into a camera
    viewfinder (not a decorative ring), and leaves with a card styled
    as a boarding-pass terminal printout.
    FIRST VIEWPORT: Full-bleed near-black terminal window, title bar top,
    a boot-sequence "$ ssh builder@hackerhouse.goa" prompt, the
    HACKER_HOUSE // GOA wordmark, and one bracket CTA — no illustration,
    no gradient, no photo needed to read as "hacker."
    FORM: Deliberately unpinned from both prior reference submissions —
    the brief explicitly asked for a direction that is "inspired, not
    similar or copied." No concept-seed roll: the direction was chosen
    by reasoning from the brief (hacker/terminal culture) rather than
    from either reference's material. Execution: code-led, no
    image-generation tool in this session.
    FINISH: unreviewed and undocumented is unfinished; this build ends
    with the finish review, the verdict, and DESIGN.md
  `.trim();

  return (
    <div style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: `<!-- ${contract} -->` }} />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-foreground font-mono">
        <DirectionContract />
        {children}
      </body>
    </html>
  );
}
