export const CARD_W = 1300;
export const CARD_H = 1630;

/**
 * Terminal / CRT-hacker world. Deliberately not the Goan-postcard palette
 * (cream, forest green, gold, magenta, scallop rings) that the other HH
 * Goa 2026 submissions we looked at converge on — a monochrome-with-one-
 * accent terminal reads as "hacker" on its own terms rather than "Goa
 * tourism board."
 */
export const COLORS = {
  bg: "#0b0d0c",
  panel: "#15201a",
  panelLine: "#22322a",
  hairline: "#2c3b33",
  amber: "#ffb300",
  amberDim: "#8a6318",
  green: "#39d372",
  greenDim: "#1f5c3a",
  red: "#ff5f57",
  yellow: "#ffbd2e",
  textBright: "#f4f1ea",
  textDim: "#7d8880",
  textFaint: "#4b544d",
} as const;

export const FONT_FAMILY = {
  monoRegular: "IBM Plex Mono",
  monoMedium: "IBM Plex Mono Medium",
  monoSemiBold: "IBM Plex Mono SemiBold",
  monoBold: "IBM Plex Mono Bold",
} as const;
