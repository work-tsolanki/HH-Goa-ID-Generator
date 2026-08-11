---
name: HH Goa 2026 Frame Generator
description: A minimalist, hhgoa.com-palette builder pass generator for Hacker House Goa 2026
colors:
  green: "#0d3b28"
  green-deep: "#092c1d"
  cream: "#f4f1ea"
  gold: "#f4c430"
  gold-dim: "#a9861f"
  pink: "#ec1e79"
  text-dim: "#9db3a4"
typography:
  display:
    fontFamily: "Abril Fatface, Georgia, serif"
    fontSize: "clamp(2.25rem, 7vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.1
  devanagari-accent:
    fontFamily: "Yatra One, cursive"
    fontWeight: 400
  body:
    fontFamily: "Poppins, sans-serif"
    fontWeight: 400
  label:
    fontFamily: "Poppins, sans-serif"
    fontWeight: 600
rounded:
  sm: "4px"
  md: "6px"
spacing:
  sm: "1rem"
  md: "1.75rem"
  lg: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.green}"
    rounded: "{rounded.sm}"
    padding: "0.875rem 1.75rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.gold}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.75rem"
---

# Design System: HH Goa 2026 Frame Generator

## Overview

**Creative North Star: "One Postcard, One Illustration, No Noise"**

This is the third visual direction for this product, and it is a deliberate
synthesis rather than a compromise: the palette and wordmark are pinned to
the *official* Hacker House Goa 2026 site (`hhgoa.com`) per the user's
direct instruction, but the structure around them follows Swiss/minimalist
discipline — one accent color, a clean grid, generous whitespace, and no
decorative chrome (no scallop rings, no terminal title bars, no dashed
borders). The one place this system allows density is a single authored
illustration: a beach scene with a developer coding at a shack counter,
which carries all of the page's "richness" so nothing else has to.

Two earlier directions preceded this one and are documented for history,
not as guidance to blend back in: an illustrated-postcard system closely
following a competing submission's card+chrome, and a from-scratch
terminal/CRT-hacker world built specifically to avoid resembling either
reference site. Neither should be revived without the user asking.

**Key Characteristics:**
- Deep forest-green ground everywhere; cream only inside the illustration and the photo frame
- Exactly one accent color (gold) carries buttons, links, focus states, and the wordmark
- Hot pink appears in exactly one place per screen: the word "गोवा"
- No shadows, no borders-as-decoration, no rings — underlines and hairlines are the only dividers
- One rich illustrated moment (the beach+coding hero scene); everything else is typography and space

## Colors

### Primary
- **Gold** (#f4c430): the only accent used for calls-to-action, links, focus rings, the wordmark, and the sun/illustration highlight. If it's interactive or important, it's gold — nothing else competes for that role.

### Secondary
- **Hot Pink** (#ec1e79): reserved exclusively for the word "गोवा" wherever the lockup appears (nav, hero, card). Never a button color, never a second accent.

### Neutral
- **Forest Green** (#0d3b28): the page and card ground — the one background color this system uses.
- **Cream** (#f4f1ea): sand/illustration fill and the card's photo-frame surround; never a page background.
- **Text Dim** (#9db3a4): secondary text on green (subline, helper copy, labels) — a muted tint of the ground hue, never plain gray.

### Named Rules
**The One Ground Rule.** Every screen's background is forest green, full stop. Cream exists only inside the illustration and the photo frame; it never becomes a page or section background.

**The Single Accent Rule.** Gold is the only color assigned to interactive elements. A second "helper" accent color for buttons, links, or focus states is a regression — route it through gold or drop the emphasis.

## Typography

**Display Font:** Abril Fatface — one static weight, used only for the wordmark and page/section headings.
**Devanagari Accent Font:** Yatra One — used exclusively for "गोवा".
**Body Font:** Poppins, weights 400–700.

**Character:** Abril Fatface's high stroke-contrast reads as a confident event wordmark, matching the official site's own lettering. Poppins stays purely functional underneath it — no second display voice competing for attention.

### Hierarchy
- **Display** (400, `clamp(2.25rem, 7vw, 3.75rem)`, line-height 1.1): the "Hacker गोवा House" wordmark and the card's builder name — the only two places this face appears.
- **Devanagari accent**: गोवा, always pink, sized to sit naturally inside its Latin context (no forced overlap or rotation this time — the restraint itself is the point).
- **Body** (400, 0.9375rem–1rem): descriptions, form copy.
- **Label** (600, 0.8125rem–0.875rem, occasionally uppercase): field labels, small captions, footer text.

### Named Rules
**The Two-Face Rule.** Exactly two typefaces exist in this system (Abril Fatface, Poppins), plus Yatra One for one word. A third face anywhere is a regression.

## Layout

Mobile-first, generous and ungridded in the literal sense but disciplined in spacing: nav and content both live in a simple centered column (`max-w-md`/`max-w-2xl`), no sidebars, no dense multi-column chrome. Every screen follows the same skeleton — a borderless, transparent nav (wordmark left, one or two quiet links/buttons right) directly on the green ground, then centered content with real breathing room between elements (`gap-6`–`gap-8`). The hero is the one exception that extends past a simple column: the illustration runs full-width beneath the centered text.

## Elevation & Depth

Flat, deliberately. No shadows anywhere in this system — depth is never simulated with `box-shadow`; color and whitespace alone establish hierarchy. The one visual "lift" device is a hover brightness/opacity shift on interactive elements, never a shadow.

### Named Rules
**The No-Shadow Rule.** If an element needs to feel "raised," that's a sign it should be simplified, not shadowed. This system has zero box-shadow declarations by design.

## Shapes

Minimal and mostly rectilinear: small border-radius (4–6px) on buttons, inputs, and the card's photo frame — never pill-shaped, never sharp 0px (that reads as brutalist, which this isn't). The photo frame is a clean bordered rectangle, not a ring or reticle. The only non-rectilinear shapes live inside the illustration itself (the sun, palm fronds, the figure).

## Components

### Buttons
- **Shape:** small radius (`rounded`, ~4-6px), never full-pill.
- **Primary:** solid gold fill, dark-green text, no border, no shadow — brightness shift on hover.
- **Secondary:** transparent fill, 1px gold border, gold text.
- **Ghost/tertiary:** text-only, dim by default, gold on hover — used for "Build another card" and back links.

### Cards / Containers
- **Corner style:** small radius (~4-6px) on the generated card image and the photo frame.
- **Background:** forest green (page) with a hairline gold border on the card face itself; no card containers elsewhere in the UI (the form has no boxed container — it sits directly on the page).
- **Border:** a single hairline (1.5-2px), gold-dim — the only border weight this system uses.

### Inputs / Fields
- **Style:** no boxed border — a single bottom hairline (`border-b`), transparent background, label above in Poppins SemiBold.
- **Focus:** hairline switches to solid gold; global `:focus-visible` also applies a themed gold outline for keyboard users.
- **Optional fields:** lower-contrast label and hairline (`text-dim`, `border-text-dim/20`) so the form doesn't read as more required fields than it has.

### Navigation
- **Style:** transparent, borderless, sits directly on the green ground. Wordmark (small Logo component) on the left, one or two quiet text links plus one button on the right. No sticky title-bar chrome.

### The Beach + Coding Illustration (signature component)
A single hand-authored SVG: sun with rays and a soft reflection, layered palm trees (background pair at reduced opacity, foreground pair full-strength framing the edges), sand, a beach shack with surfboards leaning against it, and — the product-specific detail — a figure seated at the shack counter with an open laptop showing a few lines of code instead of a menu. This is the one place in the system where density and illustration detail are allowed; it should never be duplicated elsewhere on the page, and nothing else on the page should compete with it for visual weight.

## Do's and Don'ts

### Do:
- **Do** keep every page background forest green; let the illustration and photo frame be the only places cream appears.
- **Do** treat gold as the single interactive-element color across the entire product.
- **Do** keep गोवा pink and only गोवा pink.
- **Do** let form fields breathe — underline style, no boxed borders, generous vertical gap between fields.
- **Do** treat an empty optional field as "omit this element," never as "fill it with placeholder text" — nothing on the permanent, public card image may be fabricated.

### Don't:
- **Don't** add a second accent color for "just one more" button or badge — route it through gold or cut it.
- **Don't** add shadows, rings, or decorative borders to UI chrome — this system has none by design.
- **Don't** reuse the scalloped-ring photo frame or the terminal title-bar chrome from earlier directions without the user asking for them back.
- **Don't** duplicate the beach illustration elsewhere on the page; it is a once-per-experience moment.
- **Don't** use emoji as icons — the one icon in this system (the upload camera glyph) is an authored single-stroke-weight SVG.
