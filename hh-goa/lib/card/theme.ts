export const CARD_W = 1300;
export const CARD_H = 1630;

export const COLORS = {
  cream: "#f7efdd",
  creamDot: "#ecdfc2",
  green: "#163a2b",
  greenDark: "#0f2b1f",
  greenLine: "#2c5843",
  gold: "#d7a53d",
  goldLight: "#f0c766",
  pink: "#e8177d",
  pinkDark: "#c20f68",
  red: "#e33b3b",
  white: "#fbf6e9",
  yellow: "#f4c430",
  yellowDark: "#e0a800",
  ink: "#1c1c1c",
  brown: "#8a5a34",
  brownDark: "#5f3d22",
  skinShadow: "rgba(0,0,0,0.08)",
} as const;

export const FONT = {
  headline: '"Zilla Slab Bold"',
  devanagari: '"Yatra One"',
  black: "Poppins Black",
  bold: '"Poppins"',
  semibold: '"Poppins"',
  regular: '"Poppins"',
} as const;

// Poppins is registered under a single family name with multiple weights
// baked into distinct registered names because @napi-rs/canvas resolves by
// family string, not CSS font-weight. See fonts.ts for the mapping.
export const FONT_FAMILY = {
  poppinsBlack: "Poppins Black",
  poppinsBold: "Poppins Bold",
  poppinsSemiBold: "Poppins SemiBold",
  poppinsMedium: "Poppins Medium",
  poppinsRegular: "Poppins Regular",
  zillaSlabBold: "Zilla Slab Bold",
  yatraOne: "Yatra One",
} as const;
