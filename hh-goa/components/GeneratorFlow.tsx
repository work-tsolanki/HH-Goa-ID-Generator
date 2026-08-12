"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { convertHeicIfNeeded } from "@/lib/heic";
import { TEMPLATE_FIELDS } from "@/lib/card/theme";
import { Button } from "./Button";
import Footer from "./Footer";
import NavHeader from "./NavHeader";
import ResultCard from "./ResultCard";

// The crop box mirrors the card's own photo slot aspect ratio, so the framing
// the user sees while cropping is the framing that actually lands on the
// card — not a square that then gets cover-fit into a wider rectangle.
const PHOTO_ASPECT = TEMPLATE_FIELDS.photo.w / TEMPLATE_FIELDS.photo.h;

// Below 1 the photo no longer fills the frame edge-to-edge (letterboxed on
// the shorter side instead) — lets a smaller source photo sit fully inside
// the crop without being force-cropped up to cover it.
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

type Step = "landing" | "build" | "result";

export type GenerateResponse = {
  id: string;
  imageUrl: string;
  shareUrl: string;
  downloadUrl: string;
  name: string;
  badgeTitle: string;
  builderClass: string;
  tagline: string;
  builderCode: string;
};

const PRESETS = [
  { label: "FULL-STACK", value: "Full-Stack Engineer" },
  { label: "AI/ML", value: "AI Engineer" },
  { label: "WEB3", value: "Solana Dev" },
  { label: "DESIGN ENG", value: "Design Engineer" },
];

const PREVIEW_DEBOUNCE_MS = 180;
const CROP_DEBOUNCE_MS = 200;

type Metrics = { vw: number; vh: number; w: number; h: number; x: number; y: number };

function inputSignature(name: string, stack: string, handle: string, photoVersion: number) {
  return `${name.trim()}|${stack.trim()}|${handle.trim()}|${photoVersion}`;
}

export default function GeneratorFlow() {
  const [step, setStep] = useState<Step>("landing");
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [raw, setRaw] = useState<string | null>(null);
  const [nat, setNat] = useState({ w: 1, h: 1 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);

  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoVersion, setPhotoVersion] = useState(0);

  // The card is generated in the background as soon as photo + name + stack
  // are all filled in (debounced), so by the time the user hits "Generate"
  // it usually just reveals an already-ready result instead of waiting.
  const [previewResult, setPreviewResult] = useState<GenerateResponse | null>(null);
  const [previewSignature, setPreviewSignature] = useState<string | null>(null);
  const reqIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const [viewSize, setViewSize] = useState({ w: 324, h: 324 / PHOTO_ASPECT });

  const cropRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragState = useRef<{ x: number; y: number } | null>(null);
  const photoUrlRef = useRef<string | null>(null);

  const ready = Boolean(photoBlob && name.trim() && stack.trim());
  const hasPhoto = raw !== null;

  // The photo panel is a single persistent element (not remounted per
  // phase), so its rendered width is tracked once via ResizeObserver rather
  // than read from the ref during render.
  useEffect(() => {
    const el = cropRef.current;
    if (!el) return;
    const update = () =>
      setViewSize({
        w: el.clientWidth || 324,
        h: el.clientHeight || 324 / PHOTO_ASPECT,
      });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const runGenerate = useCallback(
    async (sig: string, blob: Blob, n: string, s: string, h: string): Promise<GenerateResponse> => {
      reqIdRef.current += 1;
      const myId = reqIdRef.current;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const form = new FormData();
      form.set("photo", blob, "pass.jpg");
      form.set("name", n.trim());
      form.set("stackRole", s.trim());
      form.set("socialUrl", h.trim());

      const res = await fetch("/api/generate", { method: "POST", body: form, signal: controller.signal });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");

      if (reqIdRef.current === myId) {
        setPreviewResult(data as GenerateResponse);
        setPreviewSignature(sig);
      }
      return data as GenerateResponse;
    },
    [],
  );

  // Background auto-generate: fires ~700ms after the user stops typing (or
  // right after a crop is confirmed), so the pass is usually already built
  // by the time they click "Generate."
  useEffect(() => {
    if (!ready || !photoBlob) return;
    const sig = inputSignature(name, stack, handle, photoVersion);
    if (sig === previewSignature) return;
    const timer = setTimeout(() => {
      runGenerate(sig, photoBlob, name, stack, handle).catch(() => {});
    }, PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [name, stack, handle, photoVersion, photoBlob, ready, previewSignature, runGenerate]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  function metrics(nextZoom?: number, nextOx?: number, nextOy?: number): Metrics {
    const { w: vw, h: vh } = viewSize;
    const s = Math.max(vw / nat.w, vh / nat.h) * (nextZoom ?? zoom);
    const w = nat.w * s;
    const h = nat.h * s;
    const mx = Math.max(0, (w - vw) / 2);
    const my = Math.max(0, (h - vh) / 2);
    const x = Math.min(mx, Math.max(-mx, nextOx ?? offset.x));
    const y = Math.min(my, Math.max(-my, nextOy ?? offset.y));
    return { vw, vh, w, h, x, y };
  }

  function setRawState(url: string) {
    setRaw(url);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }

  const handleFile = useCallback(async (raw: File | null | undefined) => {
    if (!raw) return;
    setError(null);
    if (raw.size > 15 * 1024 * 1024) {
      setError("That photo is too large. Please pick one under 15MB.");
      return;
    }
    setBusy(true);
    try {
      const file = await convertHeicIfNeeded(raw);
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        const img = new Image();
        img.onload = () => {
          imgRef.current = img;
          setNat({ w: img.naturalWidth, h: img.naturalHeight });
          setRawState(url);
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Couldn't read that photo. Try a different one (JPG, PNG, WEBP, or HEIC).");
    } finally {
      setBusy(false);
    }
  }, []);

  // Auto-saves the current pan/zoom framing as the working photo — no
  // "confirm" step. Debounced so a drag or a zoom scroll doesn't redraw the
  // canvas on every intermediate frame, only once motion settles.
  function commitCrop() {
    const img = imgRef.current;
    if (!img || !cropRef.current) return;
    const { vw, vh, w, h, x, y } = metrics();
    const OUT_W = 1200;
    const OUT_H = Math.round(OUT_W / PHOTO_ASPECT);
    const f = OUT_W / vw;
    const canvas = document.createElement("canvas");
    canvas.width = OUT_W;
    canvas.height = OUT_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, OUT_W, OUT_H);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, ((vw - w) / 2 + x) * f, ((vh - h) / 2 + y) * f, w * f, h * f);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
        photoUrlRef.current = url;
        setPhotoBlob(blob);
        setPhotoVersion((v) => v + 1);
      },
      "image/jpeg",
      0.92,
    );
  }

  // Re-commits the crop automatically whenever the photo or its framing
  // changes, so the user never has to click a "use this crop" button.
  useEffect(() => {
    if (!raw) return;
    const timer = setTimeout(commitCrop, CROP_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- commitCrop reads current raw/zoom/offset/viewSize via closure each time this effect body runs
  }, [raw, zoom, offset, viewSize]);

  function goLanding() {
    setStep("landing");
  }

  function startOver() {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    photoUrlRef.current = null;
    abortRef.current?.abort();
    setStep("build");
    setName("");
    setStack("");
    setHandle("");
    setRaw(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setPhotoBlob(null);
    setPreviewResult(null);
    setPreviewSignature(null);
    setResult(null);
    setError(null);
  }

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || !photoBlob) return;
    setError(null);

    const sig = inputSignature(name, stack, handle, photoVersion);
    if (previewResult && previewSignature === sig) {
      setResult(previewResult);
      setStep("result");
      return;
    }

    setSubmitting(true);
    try {
      const data = await runGenerate(sig, photoBlob, name, stack, handle);
      setResult(data);
      setStep("result");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepChip = (label: string, bg: string, light = false) => (
    <span
      className={`neu font-display px-3.5 py-2.5 text-[12px] tracking-[0.01em] uppercase ${light ? "text-paper" : "text-ink"}`}
      style={{ background: bg }}
    >
      {label}
    </span>
  );

  return (
    <div
      className={`relative z-10 flex w-full flex-1 flex-col ${
        step === "landing" ? "h-dvh overflow-hidden" : "min-h-dvh"
      }`}
    >
      <NavHeader
        onLogoClick={goLanding}
        ctaLabel={step === "landing" ? "CREATE" : "START OVER"}
        onCtaClick={step === "landing" ? () => setStep("build") : startOver}
      />

      {step === "landing" && (
        <main className="relative z-1 flex flex-1 flex-col">
          <section className="animate-pop-in relative flex-none">
            {/* Corner-leaf crop of the single hero-scene.png, sitting behind
                the text as a full-width background layer (not a separate
                stitched asset — same file the scene strip below reuses).
                hero-scene.png is 2400x1584 with leaf content starting at
                row 178; this crops a tight 2400/260 window (rows 178-438)
                so only the dense upper leaf cluster shows, not the thin
                tapering fronds further down that would sprawl into the
                headline/paragraph below. */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
              style={{ aspectRatio: "2400 / 260" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static illustration, not a Next-optimizable content asset */}
              <img
                src="/frame-generator/hero-scene.png"
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full"
                style={{ objectFit: "cover", objectPosition: "center 13.4%" }}
              />
            </div>
            <div className="mx-auto w-full max-w-[1240px] px-4 pt-5 pb-3.5 sm:px-10 sm:pt-8">
              <div className="animate-badge-float neu neu-lg mx-auto mb-4 flex w-fit flex-col gap-1 bg-forest px-4 py-2.5 sm:px-5 sm:py-3.5">
                <h1 className="font-display text-[clamp(19px,4.4vw,46px)] leading-[0.86] tracking-[-0.03em] whitespace-nowrap text-paper uppercase">
                  HACKER HOUSE{" "}
                  <span className="font-devanagari text-pink normal-case" style={{ fontSize: "0.85em" }}>
                    गोवा
                  </span>{" "}
                  26
                </h1>
                <span className="font-body text-[9px] font-bold tracking-[0.2em] text-paper/60 uppercase sm:text-[11px]">
                  Residency 2026 · Builder Pass
                </span>
              </div>
              <p className="mt-10 font-display text-[clamp(19px,3vw,34px)] leading-[0.95] tracking-[-0.02em] uppercase">
                Build in Goa, ship from{" "}
                <span
                  className="text-pink"
                  style={{ WebkitTextStroke: "2px #101010", paintOrder: "stroke fill" }}
                >
                  paradise
                </span>
              </p>
              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-4 sm:gap-8">
                <p className="max-w-[40ch] font-body text-[clamp(14px,1.5vw,17px)] leading-normal">
                  Drop a photo, name your stack, and walk out with a builder pass built for the
                  timeline. Two fields. No sign-up.
                </p>
                <Button tone="gold" size="lg" className="neu-lg whitespace-nowrap" onClick={() => setStep("build")}>
                  Create My Pass →
                </Button>
              </div>
            </div>
          </section>

          <section className="relative min-h-0 flex-1 overflow-hidden">
            {/* Fills whatever vertical space is left after the nav, hero
                text, and footer take their heights — the page is locked to
                one viewport (see the h-dvh wrapper above), so this can't
                rely on a fixed aspect-ratio; it has to adapt to whatever
                room remains instead. That's exactly what broke on real
                phones: hero-scene.png's full 2400x1584 canvas is mostly
                transparent between the top leaf crop and the ground scene
                (which only starts at row 959), and on a container shaped
                taller than the source image's own aspect ratio,
                object-fit:cover scales by height to guarantee coverage —
                which crops nothing vertically, so the transparent middle
                band rendered instead of the ground scene, showing the
                fixed page background through it. hero-scene-ground.png
                (scripts/crop-ground-scene.mjs) is a pre-crop of just that
                dense band (rows 959-1584, 2400x625) so cover always has
                real content to show regardless of container shape. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- static illustration, not a Next-optimizable content asset */}
            <img
              src="/frame-generator/hero-scene-ground.png"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full"
              style={{ objectFit: "cover", objectPosition: "center bottom" }}
            />
          </section>
        </main>
      )}

      {step === "build" && (
        <main className="animate-pop-in relative z-1 mx-auto flex w-full max-w-[1240px] flex-1 justify-center px-4 pt-8 pb-28 sm:px-10 sm:pt-14">
          <div className="flex w-full max-w-[560px] flex-col gap-8">
            <div className="flex gap-2">
              {stepChip("01 PHOTO", "#FF0080", true)}
              {stepChip("02 DETAILS", photoBlob ? "#FEE101" : "#FFF3D6")}
              {stepChip("03 SHIP", ready ? "#FEE101" : "#FFF3D6")}
            </div>

            {/* A single persistent photo panel. Once a photo is loaded, the
                box is always live for drag/zoom — there is no separate
                "confirm crop" step; the current framing auto-saves itself
                (debounced) whenever it changes. */}
            <div className="neu flex flex-col gap-3.5 bg-[#FFFDF6] p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2.5">
                <span className="font-display text-[16px]">YOUR PHOTO</span>
                {hasPhoto && (
                  <span className="font-body text-[10px] font-medium tracking-[0.18em]">
                    DRAG TO MOVE · SCROLL TO ZOOM
                  </span>
                )}
              </div>

              <div
                ref={cropRef}
                onClick={!hasPhoto ? () => inputRef.current?.click() : undefined}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  void handleFile(e.dataTransfer.files?.[0]);
                }}
                onPointerDown={
                  hasPhoto
                    ? (e) => {
                        dragState.current = { x: e.clientX, y: e.clientY };
                        e.currentTarget.setPointerCapture(e.pointerId);
                        e.currentTarget.style.cursor = "grabbing";
                      }
                    : undefined
                }
                onPointerMove={
                  hasPhoto
                    ? (e) => {
                        if (!dragState.current) return;
                        const dx = e.clientX - dragState.current.x;
                        const dy = e.clientY - dragState.current.y;
                        dragState.current = { x: e.clientX, y: e.clientY };
                        const m = metrics(undefined, offset.x + dx, offset.y + dy);
                        setOffset({ x: m.x, y: m.y });
                      }
                    : undefined
                }
                onPointerUp={
                  hasPhoto
                    ? (e) => {
                        dragState.current = null;
                        e.currentTarget.style.cursor = "grab";
                      }
                    : undefined
                }
                onPointerCancel={hasPhoto ? () => (dragState.current = null) : undefined}
                onWheel={
                  hasPhoto
                    ? (e) => {
                        e.preventDefault();
                        const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom - e.deltaY * 0.0016));
                        const m = metrics(z, offset.x, offset.y);
                        setZoom(z);
                        setOffset({ x: m.x, y: m.y });
                      }
                    : undefined
                }
                className={`relative mx-auto w-full max-w-[330px] overflow-hidden border-[3px] border-ink select-none ${
                  hasPhoto ? "cursor-grab touch-none" : "cursor-pointer"
                }`}
                style={{
                  aspectRatio: PHOTO_ASPECT,
                  background: hasPhoto ? "#101010" : dragActive ? "#FEE101" : "#FFFDF6",
                }}
              >
                {hasPhoto &&
                  (() => {
                    const m = metrics();
                    return (
                      <div
                        className="absolute inset-0 bg-no-repeat"
                        style={{
                          backgroundImage: `url(${raw})`,
                          backgroundSize: `${m.w.toFixed(1)}px ${m.h.toFixed(1)}px`,
                          backgroundPosition: `${((m.vw - m.w) / 2 + m.x).toFixed(1)}px ${((m.vh - m.h) / 2 + m.y).toFixed(1)}px`,
                        }}
                      />
                    );
                  })()}

                {hasPhoto && (
                  <svg viewBox="0 0 90 90" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                    <g stroke="#FFF3D6" strokeWidth="0.4" opacity="0.45">
                      <path d="M30 0v90M60 0v90M0 30h90M0 60h90" />
                    </g>
                    <g stroke="#FEE101" strokeWidth="1.4" fill="none">
                      <path d="M4 14V4h10M76 4h10v10M86 76v10H76M14 86H4V76" />
                    </g>
                  </svg>
                )}

                {!hasPhoto && (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
                    <span className="neu flex h-13 w-13 items-center justify-center bg-gold font-display text-[22px]">
                      ＋
                    </span>
                    <span className="font-display text-[20px]">DROP YOUR PHOTO</span>
                    <span className="font-body text-[12px] font-medium tracking-[0.14em]">
                      OR TAP TO BROWSE · JPG PNG WEBP HEIC · 10MB
                    </span>
                  </div>
                )}

                {busy && (
                  <span className="bg-paper/85 absolute inset-0 flex items-center justify-center font-display text-[14px]">
                    Preparing photo&hellip;
                  </span>
                )}
              </div>

              {hasPhoto && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-[13px]">−</span>
                    <input
                      type="range"
                      min={MIN_ZOOM}
                      max={MAX_ZOOM}
                      step="0.01"
                      value={zoom}
                      onChange={(e) => {
                        const z = parseFloat(e.target.value);
                        const m = metrics(z, offset.x, offset.y);
                        setZoom(z);
                        setOffset({ x: m.x, y: m.y });
                      }}
                      className="h-6 flex-1 cursor-pointer accent-pink"
                    />
                    <span className="font-display text-[13px]">＋</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <Button
                      type="button"
                      tone="paper"
                      onClick={() => {
                        setZoom(1);
                        setOffset({ x: 0, y: 0 });
                      }}
                    >
                      Reset
                    </Button>
                    <Button type="button" tone="paper" onClick={() => inputRef.current?.click()}>
                      Change Photo
                    </Button>
                  </div>
                </>
              )}
            </div>

            <form onSubmit={generate} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="font-body text-[11px] font-bold tracking-[0.22em]">YOUR NAME</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                  placeholder="Who's shipping?"
                  className="neu bg-white px-4 py-4 font-body text-[19px] text-ink outline-none focus:bg-[#FFFDF6] focus:shadow-[5px_5px_0_var(--color-pink)]"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-body text-[11px] font-bold tracking-[0.22em]">WHAT&rsquo;S YOUR STACK?</span>
                <input
                  value={stack}
                  onChange={(e) => setStack(e.target.value)}
                  maxLength={26}
                  placeholder="AI Engineer"
                  className="neu bg-white px-4 py-4 font-body text-[19px] text-ink outline-none focus:bg-[#FFFDF6] focus:shadow-[5px_5px_0_var(--color-pink)]"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setStack(p.value)}
                    className="border-[3px] border-ink bg-paper px-3 py-2.5 font-body text-[11px] font-bold tracking-[0.14em] transition-colors hover:bg-gold"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <label className="flex flex-col gap-2">
                <span className="font-body text-[11px] font-bold tracking-[0.22em]">X HANDLE — OPTIONAL</span>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  maxLength={20}
                  placeholder="@247pmstudio"
                  className="neu bg-white px-4 py-4 font-body text-[19px] text-ink outline-none focus:bg-[#FFFDF6] focus:shadow-[5px_5px_0_var(--color-pink)]"
                />
              </label>

              {error && (
                <p className="neu border-pink! bg-paper px-4 py-3 font-body text-[13px] font-medium text-pink">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                tone={ready ? "gold" : "paper"}
                size="lg"
                className={`neu-lg ${ready ? "" : "cursor-not-allowed opacity-50"}`}
                disabled={!ready || submitting}
              >
                {submitting ? "Shipping…" : ready ? "Generate My Pass" : "Not Ready To Ship"}
              </Button>
            </form>
          </div>
        </main>
      )}

      {step === "result" && result && <ResultCard result={result} onStartOver={startOver} />}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      <Footer />
    </div>
  );
}