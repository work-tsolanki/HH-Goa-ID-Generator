# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two overlapping audiences:
- **Hacker House Goa 2026 attendees/builders**, generating a personal "builder pass" card to share on X ahead of the event (28–31 Oct 2026, Goa, India).
- Secondarily, the same device may be used **kiosk-style at the physical event** — one shared device, a line of people generating cards back-to-back, then moving on.

## Product Purpose

This build is a **shortlisting-competition submission** for Hacker House Goa 2026: the goal is to match or beat the current #1-scoring leaderboard submission's craft, specificity, and visual identity, not just to be functionally correct. Success is judged on how convincingly the whole experience (not only the final card image) reads as authored for this specific event.

## Positioning

Superseded a third time since the original brief. Current direction: a **neubrutalist festival-pass world**, pinned by an executable comp the user authored themselves in Claude Design (`HH Goa 2026 Frame Generator v3.dc.html` + `PassCard.dc.html`, imported via the claude_design MCP) and handed over with the explicit instruction "Implement" — the comp is the spec, not a mood reference. Cream paper ground (`#FFF3D6`/`#FBF1DC`), 3px ink borders with hard offset box-shadows that press on hover/active, Archivo Black display type, Space Grotesk body/label type, गोवा set in Noto Serif Devanagari pink, a lime CTA, a forest-green brand block and pass header, and a dot-grid + diagonal-band paper texture behind every screen. Per `new-work.md` section 3, "a user- or brief-pinned direction beats the roll, always" — this build skipped the concept-seed dice round because the direction was already fully committed by the user's own artifact.

Earlier, now-abandoned directions (kept here for history, not to be revived unprompted): (1) match `hhgoa-own-id-card.vercel.app`'s illustrated-postcard card+chrome closely; (2) a deliberately unique terminal/hacker-CRT world (near-black, amber monospace); (3) a Swiss/minimalist system pinned to `hhgoa.com`'s own deep-green/gold/pink palette with no shadows or borders-as-decoration. None should be revived without the user asking.

## Operating Context

- No login/signup; one continuous flow: upload photo → name + stack/role → generate → download/share.
- Card is generated server-side (`@napi-rs/canvas`) and persisted to Vercel Blob so `/share/[id]` can serve real Open Graph image tags for X link previews.
- Primary target is mobile Safari/Chrome; must also hold up as a shared kiosk flow (repeat use, fast reset between people) and on wider/desktop viewports (organizers, press).

## Capabilities and Constraints

- Stack is fixed (existing codebase): Next.js 16 App Router, Tailwind v4, `@napi-rs/canvas` for card rendering, Vercel Blob for storage, `qrcode` for the QR (the on-card "barcode" is a deterministic decorative bar pattern hashed from the builder id + stack, matching the comp — not a scannable `bwip-js` barcode; that dependency was removed).
- Card render must stay fast (sub-3-second, no external API calls) — the flavor-text ("Builder Class" / tagline) engine is a local deterministic keyword+hash mapping, not an LLM call.
- HEIC/HEIF photos are converted client-side before upload; the crop tool (drag + wheel-zoom) always re-encodes to a 900×900 JPEG before it reaches the server, so the server only ever receives JPEG.
- Open decision: whether the shared/kiosk usage pattern needs an explicit "reset for next person" affordance beyond the existing "Build another card" button — not yet designed.

## Brand Commitments

- Name: "HH Goa 2026 Frame Generator." Event name "Hacker House Goa 2026" / "HACKER HOUSE गोवा 26" lockup (गोवा always the one hot-pink element on a page). Hashtag `#FrameInGoa`. Event dates "28–31 OCT 2026", location "ANJUNA · GOA, INDIA" (per the pinned comp's own pass copy). Footer signs off "2:47 pm STUDIO."
- Palette: neubrutalist structure from the v3 comp (cream paper ground `#FFF3D6` header/nav, `#FBF1DC` page, ink `#101010` for borders/text), recolored on the user's instruction with **hhgoa.com's own verified accent colors**, read live from the site's CSS custom properties rather than guessed: forest green `#0B6839` (their `--background`/`--primary`) for the brand block/pass header, yellow `#FEE101` (their `--secondary`) as the single primary-action color (replacing the comp's lime), hot pink `#FF0080` (their `--accent`) reserved for गोवा and the Share-to-X action. Display wordmark in Archivo Black; body/UI/labels in Space Grotesk; गोवा set in Noto Serif Devanagari.
- Structural discipline: neubrutalist — every interactive surface gets a 3px ink border and a hard offset box-shadow that presses in on hover/active (`.neu`/`.neu-btn` in `globals.css`). No soft shadows, no rounded pill buttons, no gradients on UI chrome (the pass card's own header block is the one deliberate gradient, per the comp).

## Evidence on Hand

- `HH Goa 2026 Frame Generator v3.dc.html` + `PassCard.dc.html` — the user's own executable Claude Design comp (imported via the claude_design MCP), the pinned spec for this build. `support.js` is its DC-runtime harness, not part of the shipped product.
- `Images/HH Goa BG Enhanced.png` (project root) — the authored line-art hero illustration (hacker-house scene: shack, palms, geodesic dome, campfire, floating code glyphs), supplied by the user and cropped (border/rivets removed) into `public/frame-generator/hero-scene.png`.
- `Inspiration 1.png` (project root) — the original #1 leaderboard submission screenshot supplied at project kickoff. No longer the pinned visual reference, but still the source of some event facts.
- `https://hhgoa.com/` / `https://hhgoa-own-id-card.vercel.app/` — earlier reference points from prior (now superseded) directions; see Positioning.
- Prior `/impeccable critique` snapshot: `.impeccable/critique/2026-08-11T12-03-49Z__app-page-tsx.md` — flagged generic surrounding chrome and a placeholder-URL bug; both were fixed and the fixes carried forward through every subsequent redesign (the card never fabricates data for an empty optional field).

## Product Principles

1. The whole journey should carry the postcard identity, not just the final export — chrome, not just content.
2. Never print placeholder/fake data onto a permanent public artifact; an empty optional field should change the layout, not fabricate content.
3. Deterministic, local generation only (no external API calls) — speed and reproducibility are part of the product's craft, not just an implementation detail.
4. Preserve the existing product mechanism and stack; this is a redesign of visual world, not a rebuild.
