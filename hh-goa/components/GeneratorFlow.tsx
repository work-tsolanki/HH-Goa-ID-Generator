"use client";

import { useState } from "react";
import BeachHeroIllustration from "./BeachHeroIllustration";
import { Button } from "./Button";
import Logo from "./Logo";
import ResultCard from "./ResultCard";
import UploadDropzone from "./UploadDropzone";

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

const STEPS = ["Upload", "Details", "Share"] as const;

const HYPE_URL = "https://x.com/search?q=%23FrameInGoa&src=typed_query&f=live";

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
  const activeStepIndex = photoFile ? 1 : 0;

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
      <section className="flex flex-1 flex-col bg-green">
        <nav className="flex items-center justify-between px-6 py-6 sm:px-12">
          <Logo />
          <div className="flex items-center gap-6">
            <a
              href={HYPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-medium text-text-dim transition-colors hover:text-gold sm:inline"
            >
              Check Hype
            </a>
            <Button variant="secondary" onClick={() => setStep("form")}>
              Build my card
            </Button>
          </div>
        </nav>

        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 pt-8 pb-16 text-center sm:pt-12">
          <h1 className="font-display text-4xl leading-tight text-gold sm:text-6xl">
            Hacker <span className="font-devanagari text-pink normal-case">गोवा</span> House
          </h1>
          <p className="mt-4 text-sm tracking-wide text-text-dim sm:text-base">
            Goa, India &middot; 28&ndash;31 Oct 2026
          </p>
          <p className="mt-6 max-w-md text-base text-cream/90">
            Upload a photo, add your name and stack, and get a shareable builder pass in
            seconds. No sign-up.
          </p>
          <Button className="mt-8" onClick={() => setStep("form")}>
            Build my card
          </Button>
        </div>

        <BeachHeroIllustration className="w-full" />
      </section>
    );
  }

  if (step === "rendering") {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 bg-green px-6 py-16 text-center">
        <span className="h-3 w-3 animate-pulse rounded-full bg-gold" />
        <p className="text-base text-cream">Rendering your builder pass&hellip;</p>
      </section>
    );
  }

  if (step === "result" && result) {
    return <ResultCard result={result} onStartOver={reset} />;
  }

  return (
    <section className="flex flex-1 flex-col bg-green">
      <nav className="flex items-center justify-between px-6 py-6 sm:px-12">
        <Logo />
        <button
          type="button"
          onClick={() => setStep("hero")}
          className="text-sm font-medium text-text-dim hover:text-gold"
        >
          Back
        </button>
      </nav>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-6">
        <ol className="flex items-center justify-center gap-3 text-xs font-semibold tracking-wide text-text-dim">
          {STEPS.map((label, i) => (
            <li key={label} className={i === activeStepIndex ? "text-gold" : ""}>
              {label}
              {i < STEPS.length - 1 && <span className="ml-3 text-text-dim/50">&middot;</span>}
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-cream">Photo</span>
            <UploadDropzone
              previewUrl={previewUrl}
              onFileReady={(file, url) => {
                setPhotoFile(file);
                setPreviewUrl(url);
              }}
            />
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-cream">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="Ada Lovelace"
              className="border-b border-text-dim/40 bg-transparent py-2 text-base text-cream outline-none placeholder:text-text-dim/60 focus:border-gold"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-cream">Stack / role</span>
            <input
              value={stackRole}
              onChange={(e) => setStackRole(e.target.value)}
              maxLength={60}
              placeholder="AI Engineer, Frontend, Founder&hellip;"
              className="border-b border-text-dim/40 bg-transparent py-2 text-base text-cream outline-none placeholder:text-text-dim/60 focus:border-gold"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text-dim">X / social URL (optional)</span>
            <input
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              maxLength={120}
              placeholder="x.com/yourhandle"
              className="border-b border-text-dim/20 bg-transparent py-2 text-base text-cream outline-none placeholder:text-text-dim/60 focus:border-gold"
            />
          </label>

          {error && <p className="text-sm text-pink">{error}</p>}

          <Button type="submit" disabled={!canSubmit} className="disabled:cursor-not-allowed disabled:opacity-40">
            Generate my card
          </Button>
        </form>

        <p className="text-center text-xs text-text-dim">
          Your card &mdash; with your photo &mdash; gets a public share link, that&apos;s how
          sharing to X works.
        </p>
      </div>
    </section>
  );
}
