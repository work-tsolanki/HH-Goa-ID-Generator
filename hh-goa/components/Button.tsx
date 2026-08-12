import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const base = "neu neu-btn inline-flex items-center justify-center gap-2.5 font-display uppercase";

const tones = {
  paper: "bg-paper text-ink",
  pink: "bg-pink text-paper",
  gold: "bg-gold text-ink",
  forest: "bg-forest text-paper",
} as const;

const sizes = {
  md: "px-2.5 py-3 text-[11px] tracking-[0.01em] sm:px-5 sm:py-3.5 sm:text-[13px] sm:tracking-[0.02em]",
  lg: "px-5 py-4 text-[14px] tracking-[0.02em] sm:px-7 sm:py-5 sm:text-[17px]",
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
