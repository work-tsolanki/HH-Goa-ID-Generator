---
name: HH Goa 2026 Frame Generator
description: An illustrated Goan-postcard builder pass generator for Hacker House Goa 2026
colors:
  green: "#163a2b"
  green-dark: "#0f2b1f"
  cream: "#f7efdd"
  gold: "#d7a53d"
  pink: "#e8177d"
  pink-dark: "#c20f68"
  yellow: "#f4c430"
  scallop-red: "#e33b3b"
  card-white: "#fbf6e9"
typography:
  display:
    fontFamily: "Zilla Slab, Georgia, serif"
    fontSize: "clamp(2.5rem, 15vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.9
  devanagari-accent:
    fontFamily: "Yatra One, cursive"
    fontSize: "1.15em"
    fontWeight: 400
  body:
    fontFamily: "Poppins, sans-serif"
    fontWeight: 400
  label:
    fontFamily: "Poppins, sans-serif"
    fontWeight: 700
    letterSpacing: "0.02em"
rounded:
  pill: "9999px"
  card: "1rem"
  input: "0.75rem"
spacing:
  sm: "0.75rem"
  md: "1.5rem"
  lg: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.pink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "1rem 2rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.green}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 2rem"
  stamp-button:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.green}"
    rounded: "0.375rem"
    padding: "0.5rem 1rem"
---

# Design System: HH Goa 2026 Frame Generator

## Overview

**Creative North Star: "The Postcard That Never Stops Being a Postcard"**

Every screen in this product is the same physical object: an illustrated
Goan travel postcard, whether that's the card a builder walks away with or
the page they used to make it. The system exists because the alternative —
a bespoke illustrated export wrapped in a generic upload-form SaaS shell —
is the default this product explicitly refuses. Forest green, gold, and
hot pink carry the whole world at page scale (Committed strategy, not
accent-scattered), a hand-lettered Devanagari word pierces the Latin
wordmark wherever the brand name appears, and the hero grounds itself in
an illustrated beach horizon (palm silhouettes, a rising sun) rather than
an abstract texture — the same authored-illustration commitment the card
itself makes, extended to the page that sells it. Task screens after the
hero carry the card's own dot-field paper texture instead. Nothing in the
chrome is generic-SaaS neutral; every screen earns its palette.

The world is pinned to a real, external reference (the current #1-scoring
submission on the HH Goa 2026 shortlisting leaderboard) — this is a
constraint, not an inspiration board, and later work should extend it
rather than drift back toward safer defaults.

**Key Characteristics:**
- Full-bleed color at page scale — green or cream, never white
- The hero grounds itself in an illustrated palm-and-sunrise horizon; task screens carry the card's own dot-field paper texture instead
- One hand-lettered Devanagari word (गोवा) breaks the Latin type wherever the name appears
- Pill-shaped primary actions; a bold-bordered "ticket stub" for the persistent nav CTA
- The scalloped rickrack photo ring is the product's signature shape, reused wherever a face appears

## Colors

Three colors carry meaning; cream and dark green are the two grounds everything else sits on.

### Primary
- **Hot Pink** (#e8177d): the only color used for a primary call-to-action ("Build my card", "Share to X", "Generate my card", the गोवा accent word). If it's pink, it's the thing to do next.

### Secondary
- **Forest Green** (#163a2b): the dominant ground on the hero and every task-screen header; also the text/outline color on cream, and the fill for the card's own Name pill.
- **Gold** (#d7a53d): the wordmark color and sun-ray/rim-light color on green grounds; also borders, focus rings, and small accent marks (sparkles) throughout.

### Neutral
- **Cream** (#f7efdd): the page ground for every task screen (form, result, share) — the card's own paper color, not a generic white.
- **Card White** (#fbf6e9): white elements that live *inside* the illustrated world (scallop ring, stamp cards) — never the page background.
- **Yellow** (#f4c430): the stamp-button and the card's own lightning-badge fill; a secondary accent, not a primary action color.

### Named Rules
**The One Ground Rule.** A screen's background is either forest green or cream — never plain white, never a neutral gray. White only exists as a small illustrated element inside the world (the scallop ring, the stamp card), never as a page ground.

**The Pink-Means-Go Rule.** Hot pink is reserved for the single primary action or the brand's own accent word. It never appears as a secondary/tertiary button color or a decorative fill.

## Typography

**Display Font:** Zilla Slab (self-hosted via next/font/google), bold/black weights
**Devanagari Accent Font:** Yatra One — used exclusively for the word गोवा
**Body Font:** Poppins, weights 400–900

**Character:** A heavy slab serif carries the postcard's "hand-stamped travel brand" voice; Yatra One's casual, slightly uneven strokes read as hand-lettering rather than typeset Devanagari, deliberately breaking the display face's formality wherever the event name appears. Poppins stays purely functional — geometric, neutral, never competing with the display voice.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 15vw, 6rem)`, line-height 0.9): the "HACKER गोवा HOUSE" wordmark only — hero h1 and the small PostcardLogo lockup, nowhere else.
- **Devanagari accent** (400, 1.15em relative to its display context, rotated -2° to -3°): गोवा, wherever the full lockup appears. Always pink, always tucked tight against the surrounding Latin letters with negative margin so it reads as piercing them, never as a plain inline word.
- **Body** (400–500, 0.875rem–1rem): form copy, subcopy, microcopy.
- **Label** (700–800, 0.75rem–0.875rem, uppercase, tracked): step-pills, footer column headers, button text, the stamp-tag lettering.

### Named Rules
**The One Word Rule.** Yatra One renders exactly one word in this system: गोवा. It is never used for body copy, labels, or any other Devanagari or Latin text — its rarity is what makes it read as a deliberate accent rather than a second body font.

## Layout

Mobile-first single column throughout: base (unprefixed) Tailwind classes are the mobile layout; `sm:`/`md:`/`lg:` only add refinement, never restructure. Content sits in `max-w-lg` (task screens) or `max-w-4xl` (hero wordmark) columns centered with `mx-auto`; everything else is full-bleed color. Every task screen (form, result, share) uses the same skeleton: a `sticky top-0` forest-green header, then a cream `dot-field`-textured body holding one `max-w-lg` column. The hero is the one full-bleed exception — no header/body split: nav plus centered content sit over a solid green ground, with palm silhouettes and a rising sun/horizon illustration anchored along the bottom edge (`SunHorizon` + `PalmTree` components, `z-0`, behind the `z-10` content).

## Elevation & Depth

Mostly flat — color and texture carry the world, not shadow. The two exceptions are both physical-object metaphors: primary CTA pills get a soft, color-tinted `shadow-lg` (e.g. `shadow-pink/30`) suggesting they sit slightly above the page, and the StampButton and card pills get a small offset `shadow-md`/`rgba(0,0,0,0.12–0.15)` block shadow suggesting a paper sticker resting on the surface, not a floating card.

### Shadow Vocabulary
- **CTA lift** (`shadow-lg shadow-{color}/20–30`): primary and secondary action pills only.
- **Sticker offset** (`~3–6px rgba(0,0,0,0.12–0.15)` solid, no blur, drawn as a second shape offset behind the element rather than a CSS `box-shadow` blur): the stamp button and every pill/badge on the illustrated card itself — a paper-sticker cue, not ambient elevation.

### Named Rules
**The Flat-Ground Rule.** Page backgrounds never carry shadow or gradient depth. Depth exists only on things that are meant to read as physical objects sitting on the page (buttons, pills, stickers) — never on the ground itself.

## Shapes

Two families, deliberately opposite: **pill** (`rounded-full`) for every primary and secondary action and badge, and **soft-rounded** (`rounded-xl`/`rounded-2xl`, ~0.75–1rem) for containers (inputs, the white form card, the generated card image itself). The one sharp-cornered exception is the StampButton (`rounded-md`, ~0.375rem, dashed border, slight rotation) — deliberately more rectangular and tilted to read as a physical stamp rather than a UI button. The signature recurring shape is the **scalloped rickrack ring** (alternating red/cream bumps around a circle) — it exists nowhere else in web design and should never be replaced with a plain solid ring once introduced to a surface.

## Components

### Buttons
- **Shape:** pill (`rounded-full`) for primary/secondary actions.
- **Primary:** solid pink fill, white text, `shadow-lg shadow-pink/20–30`, `active:scale-95` press feedback. One per screen, always the visually largest/first action.
- **Secondary:** transparent fill, 2px green (or white on green grounds) border, no shadow — used for "Download PNG" and other non-primary actions.
- **Stamp button** (signature, nav-only): yellow fill, 2px solid dark-green border (a ticket-stub cue, matching the event site's own "APPLY" button — no drop shadow; this isn't a neobrutalist world, so the border alone carries the physicality), `-rotate-2` at rest straightening to `rotate-0` on hover — a physical "stamp settling into place" interaction, the system's one signature motion moment.

### Cards / Containers
- **Corner style:** `rounded-2xl` (~1rem).
- **Background:** white on cream (form container), or the illustrated card's own cream/gold/green border stack.
- **Border:** `border border-green/10` — a whisper, not a stroke.
- **Internal padding:** `p-5`–`p-6`.

### Inputs / Fields
- **Style:** `rounded-xl`, 1px `border-green/20` (required fields) or `border-green/10` (optional fields) — the optional social-URL field is deliberately lower-contrast so the form doesn't read as four required fields.
- **Focus:** themed `outline: 3px solid gold` via a global `:focus-visible` rule — never the browser default blue, and never a `border-radius` override that would fight the element's own corner shape.

### Navigation
- **Style:** forest-green `sticky top-0` bar on every task screen, holding the PostcardLogo lockup + page context on the left, a single text link or StampButton action on the right. The hero uses the same nav pattern without the sticky/scroll behavior (it's the only screen tall enough that "home" doesn't need to follow you).

### The Scallop Ring (signature component)
An SVG ring of ~50–60 alternating red/cream circular bumps around a photo — the exact motif the generated card uses to frame the builder's photo, reused live around the upload preview so the product's signature shape appears before the card is even rendered. Never substitute a solid `ring-*` utility for this once a photo-framing context is established; a solid ring in a place the scallop belongs is a visible regression, not a simplification.

## Do's and Don'ts

### Do:
- **Do** carry the `dot-field` texture onto every new task screen, and the palm/horizon illustration onto any new full-bleed marketing surface — whichever motif matches the screen's role, that's the cheapest, highest-leverage signal it belongs to this world.
- **Do** keep exactly one primary (pink, pill) action per screen.
- **Do** reuse the scallop ring wherever a person's photo is framed, not just on the final card.
- **Do** theme focus, selection, and any other browser-default surface from the palette (gold focus ring, pink selection) — never leave a default blue/gray showing.
- **Do** treat an empty optional field as "omit this element," never as "fill it with placeholder text" — nothing on the permanent, public card image may be fabricated.

### Don't:
- **Don't** use emoji as icons. Every icon is an authored single-stroke-weight SVG (see `CameraIcon`), matching the card's own line weight.
- **Don't** put a page background on plain white or gray — cream or forest green only.
- **Don't** use Yatra One for anything other than the word गोवा.
- **Don't** add a kicker/eyebrow label above any heading — the heading itself, plus the postcard chrome around it, carries the weight.
- **Don't** apply `border-radius` inside the global `:focus-visible` rule — it fights `rounded-full`/`rounded-xl` utilities via cascade order and visibly snaps pill buttons to square corners on focus.
