// One-off build helper: crops the dense "ground scene" band out of the
// full hero-scene.png (which is mostly transparent between the top leaf
// crop and the ground scene) into its own asset. Needed because
// object-fit:cover picks whichever scale (width- or height-driven)
// guarantees full coverage — on a container proportioned taller than the
// source image's own aspect ratio, that's the height-driven scale, which
// applies zero vertical crop and renders the transparent middle band
// instead of the ground scene, letting the fixed page background show
// through. A crop containing only the dense content sidesteps this for
// any realistic container shape.
import { loadImage, createCanvas } from "@napi-rs/canvas";
import { writeFile } from "node:fs/promises";

const SRC = "public/frame-generator/hero-scene.png";
const OUT = "public/frame-generator/hero-scene-ground.png";
const CROP_TOP = 959; // first non-transparent row, verified by alpha scan

const img = await loadImage(SRC);
const w = img.width;
const h = img.height - CROP_TOP;
const canvas = createCanvas(w, h);
const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, CROP_TOP, w, h, 0, 0, w, h);
await writeFile(OUT, canvas.toBuffer("image/png"));
console.log(`Wrote ${OUT} (${w}x${h})`);
