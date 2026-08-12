---
name: HH Goa 2026 Frame Generator
description: A neubrutalist festival-pass builder for Hacker House Goa 2026
colors:
  paper: "#fff3d6"
  paper-deep: "#fbf1dc"
  ink: "#101010"
  forest: "#0b6839"
  forest-deep: "#063d20"
  gold: "#fee101"
  pink: "#ff0080"
  cream: "#f3e7ce"
typography:
  display:
    fontFamily: "Archivo Black, sans-serif"
    fontWeight: 400
    textTransform: uppercase
  devanagari-accent:
    fontFamily: "Noto Serif Devanagari, serif"
    fontWeight: 600
  body:
    fontFamily: "Space Grotesk, sans-serif"
    fontWeight: 400
  label:
    fontFamily: "Space Grotesk, sans-serif"
    fontWeight: 700
    letterSpacing: "0.22em"
rounded:
  none: "0px"
spacing:
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    border: "3px solid {colors.ink}"
    shadow: "7px 7px 0 {colors.ink}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    border: "3px solid {colors.ink}"
    shadow: "4px 4px 0 {colors.ink}"
---

# Design System: HH Goa 2026 Frame Generator

## Overview

**Creative North Star: "A Pass You'd Actually Flash"**

This is the fourth visual direction for this product, and unlike the three
before it, it was not invented in this thread: the user handed over a
fully-executable Claude Design comp — `HH Goa 2026 Frame Generator
v3.dc.html` and `PassCard.dc.html` — with the instruction "Implement." The
comp is the spec, not a mood board. The world is neubrutalist festival
merch: thick ink borders, hard offset shadows that physically press on
hover/active, a cream paper ground, and a laminated builder pass with a
pill-shaped photo frame, a deterministic pseudo-barcode, and a real QR
code. An authored line-art illustration (hacker house, palms, geodesic
dome, campfire, floating code glyphs) carries the one full-bleed rich
moment on the landing page.

The comp's own accent palette was then swapped, on the user's explicit
instruction, for **hhgoa.com's real accent colors** — read live from that
site's CSS custom properties (`--background`/`--primary: #0b6839`,
`--secondary: #fee101`, `--accent: #ff0080`) rather than assumed. The
neubrutalist structure (borders, hard shadows, cream ground) stays from
the comp; only the hue family changed.

Three earlier directions preceded this one and are documented for
history, not as guidance to blend back in: (1) an illustrated-postcard
system closely following a competing submission's card+chrome, (2) a
from-scratch terminal/CRT-hacker world, (3) a Swiss/minimalist system
pinned to an earlier, unverified guess at hhgoa.com's palette with zero
shadows or decorative borders. None should be revived without the user
asking.

**Key Characteristics:**
- Cream paper ground everywhere on UI chrome; the pass itself is the one place a dark forest-green surface appears
- Every interactive element gets a 3px ink border and a hard offset box-shadow that shrinks and shifts on press — no soft shadows anywhere
- Archivo Black carries every headline and label at full commitment (uppercase, tight tracking); Space Grotesk carries everything readable at length
- गोवा is always Noto Serif Devanagari, always hot pink — the one place pink appears outside the Share-to-X action
- A fixed dot-grid + rotated gold band + oversized "PASS"/"गोवा" watermark sits behind every screen, low-contrast enough to never compete with content
- The pass builds itself in the background as the user types (debounced); "Generate" is a reveal, not a wait — there is no loading-screen theater anywhere in this flow

## Colors

### Primary
- **Gold** (#fee101): hhgoa.com's own `--secondary` yellow — the single primary call-to-action color across the whole product ("Create My Pass," "Generate My Pass," Download, confirm actions, the pass's MEMBER pill and PASS NO. value). If it's the one thing the user should do next, it's this yellow.
- **Ink** (#101010): every border, most body text, and the crop-tool corner-bracket ground. This is a border-and-text color, never a large fill.

### Secondary
- **Hot Pink** (#ff0080): hhgoa.com's own `--accent` — गोवा wherever the lockup appears, the Share-to-X action, and the pass's stack/role line. Never a neutral UI color.
- **Forest** (#0b6839) / **Forest Deep** (#063d20): hhgoa.com's own `--background`/`--primary` green — the brand button, the pass's photo-header block (as a gradient), and the pass's bottom bar.

### Neutral
- **Paper** (#fff3d6): nav/header/footer-adjacent chrome ground.
- **Paper Deep** (#fbf1dc): the page ground behind everything (the fixed texture layer's base color).
- **Cream** (#f3e7ce): the pass's own laminate face color — distinct from the page's paper tones, reserved for the card artifact itself.

### Named Rules
**The Hard Shadow Rule.** Every clickable surface (buttons, the brand button, step chips, the dropzone) carries a 3px ink border and an offset box-shadow via the shared `.neu`/`.neu-btn` CSS classes; the shadow shrinks and the element translates toward it on press. A soft `box-shadow` blur anywhere in UI chrome is a regression.

**The Verified-Palette Rule.** The forest/gold/pink triad is not invented — it is read from hhgoa.com's live CSS custom properties. If the official site's palette ever changes, this system's accent colors should be re-verified from the source, not guessed from memory.

**The One-Pink Rule.** Hot pink marks गोवा and the single most social action (Share to X) — never a neutral button, never a second "just one more" accent.

## Typography

**Display Font:** Archivo Black — one static black weight, used for every headline, nav label, button label, and the pass's builder name.
**Devanagari Accent Font:** Noto Serif Devanagari (weight 600) — used exclusively for गोवा.
**Body Font:** Space Grotesk, weights 400–700 — body copy, form inputs, and every small tracked label.

**Character:** Archivo Black's uniform heavy weight is what makes the neubrutalist register read as confident rather than decorative — it's the same face on a hero headline and a tiny step chip, never softened. Space Grotesk stays geometric and slightly technical underneath it, matching the "builder" subject without becoming a second display voice.

### Hierarchy
- **Display**: hero headline (`clamp(40px,7.6vw,96px)`), the pass's builder name (fit-to-width, up to 109px), nav/button labels (12–19px, tracked).
- **Devanagari accent**: गोवा, always pink, sized to sit naturally inside its Latin context.
- **Body**: form values, descriptions (14–19px).
- **Label**: field labels, step chips, footer copy — bold, uppercase or wide-tracked, 10–13px.

### Named Rules
**The Two-Face Rule.** Exactly two typefaces exist in this system (Archivo Black, Space Grotesk), plus Noto Serif Devanagari for one word. A third face anywhere is a regression.

## Layout

Content lives in a centered column (`max-w-[560px]` for the build form, `max-w-[1240px]` for the landing hero) directly on the fixed paper-deep texture. Every screen shares the same skeleton: a sticky bordered header (brand button left, Check Hype + primary CTA right), step-specific main content, and a dark forest footer bar. The landing hero is the one full-bleed exception — the illustration runs edge-to-edge beneath the headline, masked with a long (42%) top fade so the headline/CTA above it always reads on clean paper before the scene begins.

## Elevation & Depth

Hard-shadow, deliberately. Every raised element uses a flat-color offset `box-shadow` (never blurred) that reads as a physically stacked layer, and presses inward on `:hover`/`:active` via `transform: translate(...)`. The pass card itself is the one place a soft-edged shadow-like effect appears (`14px 14px 0 var(--color-ink)` — still a hard offset, just larger, to read as "propped up" on the page).

### Named Rules
**The Press Rule.** Every `.neu-btn` shrinks its shadow and translates toward it on `:active` — the tactile "this is a real button" cue this whole system depends on. An element with hover/active states that skips this is unfinished.

## Shapes

Rectilinear and unapologetic: 3px square-cornered borders everywhere in UI chrome — no rounded corners on buttons, inputs, or step chips. The one deliberate exception is the pass's own photo frame: a pill-topped shape (large top radius, small bottom radius) with a gold ring, which is this system's signature silhouette and should never be flattened to a plain rectangle.

## Components

### Buttons
- **Shape:** 3px ink border, hard offset shadow, zero border-radius.
- **Tones:** gold (primary action — every "go forward" button in the product), pink (Share to X), paper (neutral / cancel-adjacent), forest (the brand/nav button, and the Download button's "Saved ✓" state).
- **Press state:** shadow shrinks from 4–7px down to 2–3px and the element translates 2–3px toward it; hover does the opposite (grows the shadow, lifts the element).

### Cards / Containers
- **The builder pass:** cream (`#f3e7ce`) laminate, no border of its own — it's presented inside a bordered/shadowed frame in the UI (`14px 14px 0` shadow), not bordered itself. Internally: a forest-gradient photo-header block with a scalloped cream hem, then a cream body with the name/stack/identity grid/QR row.
- **UI containers** (crop tool panel, dropzone): 3px ink border, hard shadow, no radius.

### Inputs / Fields
- **Style:** 3px ink border, hard 5px offset shadow, white/paper fill, Space Grotesk 19px value text.
- **Focus:** shadow color switches from ink to pink (`box-shadow: 5px 5px 0 var(--color-pink)`), background lightens slightly.
- **Optional fields:** same visual weight as required fields (this system doesn't lower-contrast optional fields) — the "optional" label text itself communicates that.

### Navigation
- **Style:** sticky, 3px bottom border, paper background. Left: the forest-green bordered brand button ("HACKER HOUSE गोवा 26"). Right: a bordered "Check Hype" link (hidden below `sm`) plus one gold primary CTA whose label and action change with the flow step (`CREATE` on landing, `START OVER` everywhere else, both routing through the same reset-to-build handler).

### The Fixed Paper Texture (signature background)
A `position:fixed` layer (mounted once in the root layout) behind every screen: a 48px dot-grid, a rotated gold band with a hazard-stripe shadow beneath it, a pink halftone dot cluster in the bottom-right corner, and two oversized low-contrast watermarks ("PASS" outline-stroked, गोवा in translucent pink). This never repeats per-route in the markup — one mount, `position:fixed`, done.

### The Hero Illustration (landing, signature moment)
A full-bleed, edge-to-edge line-art scene (authored asset, `public/frame-generator/hero-scene.png`, cropped from the user's source art with its border/corner-rivets removed so it bleeds cleanly): a hacker house with builders coding on a deck, a geodesic dome, a campfire circle, palms framing both edges, and floating code-glyph doodles ({}, <>, </>) filling the sky. Masked with a long top-fade gradient (42%) into the page so the headline above always stays legible. This is the one place per experience this density is allowed.

### The Builder Pass (signature artifact)
Rendered server-side via `@napi-rs/canvas` (`lib/card/render.ts` + `lib/card/layers/*`) at 1300×1630px, matching `PassCard.dc.html`. Header block (forest gradient, 64% of the card height): a three-line brand lockup ("HACKER गोवा HOUSE" / "RESIDENCY 2026 · BUILDER PASS" / "ACCESS ALL STATIONS OF THE BUILD"), a MEMBER pill, a pill-shaped gold-ringed photo with a rotated pink "VERIFIED / HH / BUILDER" seal pinned over its corner, a 2×3 detail grid (DATES, VENUE, COHORT, ZONE, PASS NO., STATUS with a checkmark glyph), and a scalloped cream hem. Body (cream): a ticket-stub motif (a rotated "TICKET NO." label and a dashed perforation line running up the left margin), fit-to-width Archivo Black name, pink stack line, a divider rule, a BUILDER CLASS / CURRENTLY SHIPPING grid, a LAND → BUILD → SHIP → LAUNCH journey stepper (gold/gold/pink/ink dots with dates), then a real QR code plus a deterministic decorative bar pattern (hashed from the builder id + stack — not a scannable barcode) under a "SCAN TO VALIDATE PASS" label. Bottom bar: "BUILD → COLLAB → SHIP" / "#FRAMEINGOA" / "LESS NOISE. MORE SIGNAL." in a three-item justified row. Generation is triggered in the background (debounced ~700ms after the user stops typing or confirms a crop), so the explicit "Generate" action almost always just reveals an already-rendered result.

## Do's and Don'ts

### Do:
- **Do** give every clickable surface a 3px ink border and a `.neu`/`.neu-btn` hard shadow with a press state.
- **Do** keep गोवा in Noto Serif Devanagari, always pink.
- **Do** treat the pass's pill-shaped photo frame as this system's signature shape — never simplify it to a plain rectangle.
- **Do** treat an empty optional field as "fall back to the share-page host," never as fabricated placeholder text on the permanent, public card image.
- **Do** keep the fixed paper texture mounted once (root layout), not repeated per route.
- **Do** re-verify hhgoa.com's live CSS custom properties before touching the accent palette again — never guess these hexes from memory.
- **Do** keep card generation running in the background as the user fills the form; never reintroduce a dedicated loading/progress screen for it.

### Don't:
- **Don't** add soft/blurred box-shadows anywhere in UI chrome — offset hard shadows only.
- **Don't** round the corners of buttons, inputs, or step chips — 0px radius is the system default outside the pass's photo frame.
- **Don't** add a second saturated accent color for "just one more" badge — route it through gold/pink/forest or cut it.
- **Don't** duplicate the hero illustration elsewhere on the page; it is a once-per-experience, landing-only moment.
- **Don't** revive the prior directions' scalloped-ring photo frame, terminal title-bar chrome, or Swiss/minimalist restraint without the user asking for them back.
