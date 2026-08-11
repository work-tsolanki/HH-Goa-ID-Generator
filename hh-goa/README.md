# HH Goa 2026 Frame Generator

Mobile-first Next.js app for Hacker House Goa 2026: upload a photo, add your
name and stack/role, and get a shareable Goan-postcard-style badge —
generated server-side and ready to download or post to X.

## How it works

- `lib/card/render.ts` composites the card entirely server-side with
  `@napi-rs/canvas` — background/borders, ribbons, headline, postage stamp,
  circular photo frame (auto center-cropped), signpost, beach scene, link
  bar, title badge, and a 3-column footer with a real QR code (`qrcode`) and
  barcode (`bwip-js`).
- `lib/card/flavor.ts` deterministically derives a "Builder Class" and
  "Currently Shipping" tagline from the stack/role text via a keyword
  lookup table + stable hash — no external API calls, so it stays fast.
- `app/api/generate/route.ts` accepts the multipart form, renders the PNG,
  and uploads it (plus a small metadata JSON) to Vercel Blob.
- `app/share/[id]/page.tsx` reads that metadata back and sets `og:image` /
  `twitter:card` to the real generated image, so X link previews show the
  actual card.
- `app/api/download/[id]/route.ts` streams the image back same-origin with
  `Content-Disposition: attachment` so the download works regardless of
  Blob CORS behavior.
- HEIC/HEIF photos are converted to JPEG client-side (`lib/heic.ts`, via
  `heic2any`) before upload, so the server only ever sees JPG/PNG/WEBP.

## Setup

```bash
npm install
```

This app stores generated images in **Vercel Blob**, so it needs a
`BLOB_READ_WRITE_TOKEN`. Easiest path:

```bash
npx vercel link       # connect this folder to a Vercel project
npx vercel blob create-store <name> --access public --yes
```

That last command creates the store, links it to the project, and writes
`BLOB_READ_WRITE_TOKEN` into `.env.local` for local dev. In production on
Vercel, linking the Blob store to the project is enough — the token is
injected automatically.

## Develop

```bash
npm run dev
```

## Fonts

Canvas rendering uses locally bundled font files in `assets/fonts/`
(Poppins, Zilla Slab, and Yatra One for the Devanagari "गोवा" headline
word) — not Google Fonts at runtime — so rendering has no network
dependency and stays fast. `next.config.ts` includes `assets/**` in the `/api/generate`
function's file trace so these ship with the deployed function.
