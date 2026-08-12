export const CARD_W = 1934;
export const CARD_H = 2400;

// Standard OG/Twitter "large image" card aspect (~1.91:1) — the badge itself
// is a tall portrait rectangle, so the share preview centers it on a padded
// landscape canvas at this size rather than handing X the raw portrait PNG,
// which it force-crops to fit a landscape frame.
export const OG_IMAGE_W = 1200;
export const OG_IMAGE_H = 630;

export const COLORS = {
  cream: "#f3e7ce",
  forestTop: "#12523a",
  forestMid: "#0b3325",
  forestDeep: "#072418",
  gold: "#e7b33c",
  pink: "#c4166b",
  ink: "#0b3325",
} as const;

export const FONT_FAMILY = {
  display: "Archivo Black",
  devanagari: "Noto Serif Devanagari",
  body: "Space Grotesk",
} as const;

/**
 * Every blank field's position on PassCard_Template-Empty-Enchanced-BG.png
 * (1934x2400 native), measured directly from the pixels via opencv color
 * masking + minAreaRect / manual crop inspection — not eyeballed. Each
 * field carries its own rotation since the source art has a very mild,
 * slightly inconsistent tilt (-2.5° to -3.3° depending on which element
 * was measured) rather than being a single perfectly rigid rotation.
 */
export const TEMPLATE_FIELDS = {
  photo: { cx: 974, cy: 1138, w: 943, h: 552, deg: -3.3 },
  nameBlock: { cx: 983, cy: 1518, w: 1000, h: 200, deg: -3 },
  builderClassChip: { cx: 742, cy: 1687, w: 466, h: 127, deg: -3 },
  shippingChip: { cx: 1236, cy: 1654, w: 497, h: 128, deg: -3 },
  qr: { cx: 570, cy: 2100, w: 140, h: 132, deg: -3 },
  barcode: { cx: 1375, cy: 2065, w: 320, h: 96, deg: -3 },
  serial: { cx: 1015, cy: 2115, w: 300, h: 80, deg: -3 },
} as const;