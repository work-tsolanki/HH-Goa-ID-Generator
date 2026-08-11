const HEIC_TYPES = new Set(["image/heic", "image/heif"]);

function looksLikeHeic(file: File): boolean {
  if (HEIC_TYPES.has(file.type.toLowerCase())) return true;
  // Mobile Safari sometimes reports an empty/generic MIME type for HEIC files.
  return /\.hei[cf]$/i.test(file.name);
}

/** Converts HEIC/HEIF photos to JPEG in-browser via WASM. Passes other types through untouched. */
export async function convertHeicIfNeeded(file: File): Promise<File> {
  if (!looksLikeHeic(file)) return file;

  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
  const blob = Array.isArray(result) ? result[0] : result;
  const newName = file.name.replace(/\.hei[cf]$/i, ".jpg");
  return new File([blob], newName || "photo.jpg", { type: "image/jpeg" });
}
