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

Reference/competing submission: `https://hhgoa-own-id-card.vercel.app/` ("Hacker Goa House · Builder Social Card Generator", by "2:47 PM Studio") — currently the #1-scoring entry. Its mechanism worth matching: a fully illustrated, hand-composited Goan-postcard card (not a template with a photo dropped in), a dark-green dot-matrix hero with an oversized serif "HACKER HOUSE" wordmark and a neon-pink "गोवा" tag, and a generator page whose own chrome (header, dotted background, step pills) carries the same illustrated-postcard identity as the card it produces — not just matching palette/fonts.

## Operating Context

- No login/signup; one continuous flow: upload photo → name + stack/role → generate → download/share.
- Card is generated server-side (`@napi-rs/canvas`) and persisted to Vercel Blob so `/share/[id]` can serve real Open Graph image tags for X link previews.
- Primary target is mobile Safari/Chrome; must also hold up as a shared kiosk flow (repeat use, fast reset between people) and on wider/desktop viewports (organizers, press).

## Capabilities and Constraints

- Stack is fixed (existing codebase): Next.js 16 App Router, Tailwind v4, `@napi-rs/canvas` for card rendering, Vercel Blob for storage, `qrcode` + `bwip-js` for the QR/barcode on the card.
- Card render must stay fast (sub-3-second, no external API calls) — the flavor-text ("Builder Class" / tagline) engine is a local deterministic keyword+hash mapping, not an LLM call.
- HEIC/HEIF photos are converted client-side before upload; server only accepts JPG/PNG/WEBP.
- Open decision: whether the shared/kiosk usage pattern needs an explicit "reset for next person" affordance beyond the existing "Build another card" button — not yet designed.

## Brand Commitments

- Name: "HH Goa 2026 Frame Generator." Event name "Hacker House Goa 2026" / "HACKER गोवा HOUSE" lockup (गोवा in hot pink/magenta, hand-lettered feel). Hashtag `#FrameInGoa`. Event dates "28–31 OCT 2026", location "GOA, INDIA."
- Illustrated Goan-postcard visual language: forest green, gold, magenta, cream palette; flat vector illustration style (postage stamp, signpost, beach house/scooter/surfboards, scalloped photo ring).

## Evidence on Hand

- `Inspiration 1.png` (project root, one level above the app) — the original #1 leaderboard submission screenshot supplied at project kickoff.
- Live reference: `https://hhgoa-own-id-card.vercel.app/` — apparent live version of that same #1 submission (by "2:47 PM Studio"), showing both its landing page and its generator page chrome.
- Prior `/impeccable critique` snapshot: `.impeccable/critique/2026-08-11T12-03-49Z__app-page-tsx.md` — flagged the generic surrounding chrome (vs. bespoke card) and a placeholder-URL bug as top priorities; both are addressed by this redesign.

## Product Principles

1. The whole journey should carry the postcard identity, not just the final export — chrome, not just content.
2. Never print placeholder/fake data onto a permanent public artifact; an empty optional field should change the layout, not fabricate content.
3. Deterministic, local generation only (no external API calls) — speed and reproducibility are part of the product's craft, not just an implementation detail.
4. Preserve the existing product mechanism and stack; this is a redesign of visual world, not a rebuild.
