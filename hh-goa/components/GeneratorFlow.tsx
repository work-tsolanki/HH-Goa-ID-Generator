"use client";

import { useState } from "react";
import PalmTree from "./PalmTree";
import PostcardLogo from "./PostcardLogo";
import ResultCard from "./ResultCard";
import StampButton from "./StampButton";
import SunHorizon from "./SunHorizon";
import UploadDropzone from "./UploadDropzone";

const HYPE_URL = "https://x.com/search?q=%23FrameInGoa&src=typed_query&f=live";

type Step = "hero" | "form" | "rendering" | "result";

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

const STEPS = [
  { key: "upload", label: "Upload Photo" },
  { key: "details", label: "Add Details" },
  { key: "share", label: "Share Pass" },
] as const;

export default function GeneratorFlow() {
  const [step, setStep] = useState<Step>("hero");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [stackRole, setStackRole] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const canSubmit = Boolean(photoFile && name.trim() && stackRole.trim());
  const activeFormStep = photoFile ? "details" : "upload";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photoFile || !canSubmit) return;

    setError(null);
    setStep("rendering");

    try {
      const form = new FormData();
      form.set("photo", photoFile);
      form.set("name", name.trim());
      form.set("stackRole", stackRole.trim());
      form.set("socialUrl", socialUrl.trim());

      const res = await fetch("/api/generate", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setResult(data as GenerateResponse);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStep("form");
    }
  }

  function reset() {
    setStep("hero");
    setPhotoFile(null);
    setPreviewUrl(null);
    setName("");
    setStackRole("");
    setSocialUrl("");
    setResult(null);
    setError(null);
  }

  if (step === "hero") {
    return (
      <section className="relative flex flex-1 flex-col overflow-hidden bg-green">
        <SunHorizon className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto w-full max-w-3xl opacity-95" />
        <PalmTree
          className="pointer-events-none absolute -bottom-3 left-0 z-0 w-28 sm:w-40 lg:w-56"
          leafColor="#1f5c41"
        />
        <PalmTree
          flip
          className="pointer-events-none absolute -bottom-3 right-0 z-0 w-28 sm:w-40 lg:w-56"
          leafColor="#1f5c41"
        />

        <nav className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10">
          <PostcardLogo dark />
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={HYPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-bold uppercase tracking-wide text-cream/80 transition-colors hover:text-gold sm:inline"
            >
              Check Hype
            </a>
            <StampButton onClick={() => setStep("form")}>Build my card</StampButton>
          </div>
        </nav>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-14 pt-4 text-center sm:pb-20">
          <h1 className="max-w-4xl font-display text-[15vw] font-bold uppercase leading-[0.9] text-gold sm:text-6xl md:text-7xl lg:text-8xl">
            Hacker{" "}
            <span className="relative -mx-1 inline-block -translate-y-1 -rotate-3 text-[1.15em] font-devanagari text-pink normal-case drop-shadow-[2px_3px_0_rgba(0,0,0,0.35)] sm:-mx-2 sm:-translate-y-2">
              गोवा
            </span>{" "}
            House
          </h1>

          <div className="flex w-full max-w-md flex-wrap items-center justify-between gap-2 rounded-xl bg-black/25 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gold sm:text-sm">
            <span>Goa, India · 28–31 Oct 2026</span>
            <span className="text-pink">#FrameInGoa</span>
          </div>

          <p className="max-w-sm text-sm text-cream/80 sm:text-base">
            Upload a photo, drop your name and stack, and get a shareable
            builder pass in seconds. No sign-up.
          </p>

          <button
            type="button"
            onClick={() => setStep("form")}
            className="mt-2 rounded-full bg-pink px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink/30 transition-transform active:scale-95"
          >
            Build my card →
          </button>
        </div>
      </section>
    );
  }

  if (step === "rendering") {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 bg-cream px-6 py-16 text-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-gold border-t-pink" />
        <p className="text-lg font-semibold text-green">Stamping your postcard…</p>
      </section>
    );
  }

  if (step === "result" && result) {
    return <ResultCard result={result} onStartOver={reset} />;
  }

  return (
    <section className="relative flex flex-1 flex-col bg-cream">
      <div className="dot-field pointer-events-none absolute inset-0" aria-hidden />

      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b-4 border-gold bg-green px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <PostcardLogo dark />
          <div className="hidden text-cream/70 sm:block">
            <div className="text-sm font-bold uppercase tracking-wide text-cream">HH Goa 2026</div>
            <div className="text-xs">Builder Pass Generator</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStep("hero")}
          className="text-sm font-bold text-gold"
        >
          ← Home
        </button>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-6 py-8">
        <ol className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide text-green/60 sm:text-sm">
          {STEPS.map((s, i) => (
            <li key={s.key} className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 ${
                  s.key === activeFormStep
                    ? "bg-pink text-white"
                    : "bg-white text-green/50"
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && <span className="text-green/30">·</span>}
            </li>
          ))}
        </ol>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl border border-green/10 bg-white p-5 shadow-lg shadow-green/5 sm:p-6"
        >
          <UploadDropzone
            previewUrl={previewUrl}
            onFileReady={(file, url) => {
              setPhotoFile(file);
              setPreviewUrl(url);
            }}
          />

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-green">Full name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="e.g. Satoshi Nakamoto"
              className="rounded-xl border border-green/20 bg-cream/40 px-4 py-3 text-base text-foreground outline-none focus:border-pink"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-green">Stack / role</span>
            <input
              value={stackRole}
              onChange={(e) => setStackRole(e.target.value)}
              maxLength={60}
              placeholder="e.g. Full-Stack / Rust / AI"
              className="rounded-xl border border-green/20 bg-cream/40 px-4 py-3 text-base text-foreground outline-none focus:border-pink"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-green/70">X / social URL (optional)</span>
            <input
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              maxLength={120}
              placeholder="x.com/yourhandle"
              className="rounded-xl border border-green/10 bg-cream/20 px-4 py-3 text-base text-foreground outline-none focus:border-pink"
            />
          </label>

          {error && <p className="text-sm font-medium text-pink-dark">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-pink px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink/20 transition-transform disabled:cursor-not-allowed disabled:bg-green/20 disabled:text-green/50 active:scale-95 disabled:active:scale-100"
          >
            Generate my card
          </button>
        </form>

        <p className="text-center text-xs text-green/50">
          Your card — with your photo — gets a public share link, that&apos;s how sharing to X works.
        </p>
      </div>
    </section>
  );
}
