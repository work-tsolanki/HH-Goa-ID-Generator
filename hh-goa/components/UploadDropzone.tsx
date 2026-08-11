"use client";

import { useCallback, useRef, useState } from "react";
import { convertHeicIfNeeded } from "@/lib/heic";
import ScallopRing from "./ScallopRing";

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9 text-green/70"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

const ACCEPTED_EXT = ".jpg,.jpeg,.png,.webp,.heic,.heif";
const MAX_BYTES = 15 * 1024 * 1024;

type Props = {
  onFileReady: (file: File, previewUrl: string) => void;
  previewUrl: string | null;
};

export default function UploadDropzone({ onFileReady, previewUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (raw: File | null | undefined) => {
      if (!raw) return;
      setError(null);

      if (raw.size > MAX_BYTES) {
        setError("That photo is too large. Please pick one under 15MB.");
        return;
      }

      setBusy(true);
      try {
        const file = await convertHeicIfNeeded(raw);
        const url = URL.createObjectURL(file);
        onFileReady(file, url);
      } catch {
        setError("Couldn't read that photo. Try a different one (JPG, PNG, WEBP, or HEIC).");
      } finally {
        setBusy(false);
      }
    },
    [onFileReady],
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
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
        className={`relative flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          dragActive ? "border-pink bg-pink/5" : "border-green/30 bg-white/60"
        } ${previewUrl ? "aspect-auto py-4" : "aspect-square"}`}
      >
        {previewUrl ? (
          <div className="relative h-56 w-56">
            <ScallopRing />
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob: object URL, not Next-optimizable */}
            <img
              src={previewUrl}
              alt="Your photo preview"
              className="absolute inset-[10%] h-[80%] w-[80%] rounded-full object-cover ring-2 ring-gold"
            />
          </div>
        ) : (
          <>
            <CameraIcon />
            <span className="font-semibold text-green">Drop your photo here</span>
            <span className="text-sm text-green/70">or tap to browse — JPG, PNG, WEBP, HEIC</span>
          </>
        )}
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-cream/80 text-sm font-semibold text-green">
            Preparing photo…
          </span>
        )}
        {previewUrl && !busy && (
          <span className="text-xs font-medium text-green/70">Tap to choose a different photo</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={`image/jpeg,image/png,image/webp,image/heic,image/heif,${ACCEPTED_EXT}`}
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      {error && <p className="mt-2 text-sm font-medium text-pink-dark">{error}</p>}
    </div>
  );
}
