"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";
import { TerminalButton } from "./TerminalButton";
import TerminalTitleBar from "./TerminalTitleBar";
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

const STEPS = [
  { key: "upload", label: "upload" },
  { key: "details", label: "details" },
  { key: "share", label: "share" },
] as const;

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
      <section className="scanlines relative flex flex-1 flex-col bg-bg">
        <TerminalTitleBar
          filename="hacker-house-goa.sh — visitor session"
          status="● LIVE"
          action={
            <>
              <a
                href={HYPE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden text-sm text-text-dim transition-colors hover:text-amber sm:inline"
              >
                check_hype
              </a>
              <TerminalButton variant="secondary" onClick={() => setStep("form")}>
                apply
              </TerminalButton>
            </>
          }
        />

        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-14 sm:px-10">
          <p className="text-base text-amber sm:text-lg">
            <span className="font-semibold">$ ssh</span> builder@hackerhouse.goa
          </p>
          <p className="mt-2 text-xs text-green sm:text-sm">
            connecting to GOA, IN (15.2993°N, 74.1240°E)… ok
            <br />
            authenticating builder session… access granted
          </p>

          <div className="my-8 border-t border-dashed border-hairline" />

          <h1 className="text-3xl font-bold uppercase leading-tight text-text-bright sm:text-5xl">
            Hacker_House <span className="text-amber">{"// Goa"}</span>
          </h1>
          <p className="mt-3 text-sm text-text-dim sm:text-base">Goa, IN &middot; 28&ndash;31 Oct 2026</p>

          <p className="mt-6 max-w-md text-sm text-text-dim sm:text-base">
            Upload a photo, set your name and stack, and get a terminal-styled builder
            pass&mdash;rendered server-side, shareable to X. No sign-up.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <TerminalButton onClick={() => setStep("form")}>./build-my-card.sh</TerminalButton>
            <span className="cursor-blink text-lg text-amber" aria-hidden>
              _
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (step === "rendering") {
    return (
      <section className="scanlines flex flex-1 flex-col items-center justify-center gap-3 bg-bg px-6 py-16 text-center">
        <p className="text-lg text-amber">$ ./generate.sh</p>
        <p className="text-sm text-text-dim">
          compiling builder_pass.png
          <span className="cursor-blink" aria-hidden>
            _
          </span>
        </p>
      </section>
    );
  }

  if (step === "result" && result) {
    return <ResultCard result={result} onStartOver={reset} />;
  }

  return (
    <section className="scanlines relative flex flex-1 flex-col bg-bg">
      <TerminalTitleBar
        filename="builder-form.sh"
        status={`step ${STEPS.findIndex((s) => s.key === activeFormStep) + 1}/${STEPS.length}`}
        action={
          <button type="button" onClick={() => setStep("hero")} className="text-sm text-text-dim hover:text-amber">
            cd ..
          </button>
        }
      />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-6 py-8">
        <ol className="flex items-center gap-2 text-xs text-text-dim">
          {STEPS.map((s, i) => (
            <li key={s.key} className="flex items-center gap-2">
              <span className={s.key === activeFormStep ? "font-semibold text-amber" : ""}>
                [{i + 1}] {s.label}
              </span>
              {i < STEPS.length - 1 && <span className="text-text-faint">&middot;</span>}
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-sm border border-hairline bg-panel p-5 sm:p-6">
          <div>
            <label className="mb-2 block text-sm text-amber" htmlFor="photo-field">
              $ upload_photo
            </label>
            <UploadDropzone
              previewUrl={previewUrl}
              onFileReady={(file, url) => {
                setPhotoFile(file);
                setPreviewUrl(url);
              }}
            />
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-amber">$ name --set</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="satoshi_nakamoto"
              className="border border-hairline bg-bg px-4 py-3 text-base text-text-bright outline-none placeholder:text-text-faint focus:border-amber"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-amber">$ role --set</span>
            <input
              value={stackRole}
              onChange={(e) => setStackRole(e.target.value)}
              maxLength={60}
              placeholder="ai-engineer / frontend / founder"
              className="border border-hairline bg-bg px-4 py-3 text-base text-text-bright outline-none placeholder:text-text-faint focus:border-amber"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-text-dim">$ social --set (optional)</span>
            <input
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              maxLength={120}
              placeholder="x.com/yourhandle"
              className="border border-hairline/50 bg-bg px-4 py-3 text-base text-text-bright outline-none placeholder:text-text-faint focus:border-amber"
            />
          </label>

          {error && <p className="text-sm text-red">error: {error}</p>}

          <TerminalButton type="submit" disabled={!canSubmit} className="disabled:cursor-not-allowed disabled:opacity-40">
            ./generate.sh
          </TerminalButton>
        </form>

        <p className="text-center text-xs text-text-faint">
          $ echo &quot;your card + photo get a public share link&quot;
        </p>
      </div>
    </section>
  );
}
