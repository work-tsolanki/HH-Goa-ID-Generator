import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const base = "neu neu-btn inline-flex items-center justify-center gap-2.5 font-display uppercase";

const tones = {
  paper: "bg-paper text-ink",
  pink: "bg-pink text-paper",
  gold: "bg-gold text-ink",
  forest: "bg-forest text-paper",
} as const;

const sizes = {
  md: "px-5 py-3.5 text-[13px] tracking-[0.02em]",
  lg: "px-7 py-5 text-[17px] tracking-[0.02em]",
} as const;

type Tone = keyof typeof tones;
type Size = keyof typeof sizes;

export function Button({
  tone = "paper",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone; size?: Size }) {
  return <button {...props} className={`${base} ${tones[tone]} ${sizes[size]} ${className}`} />;
}

export function LinkButton({
  tone = "paper",
  size = "md",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { tone?: Tone; size?: Size }) {
  return <a {...props} className={`${base} ${tones[tone]} ${sizes[size]} ${className}`} />;
}
