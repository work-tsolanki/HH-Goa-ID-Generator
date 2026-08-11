import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const base = "inline-flex items-center justify-center font-semibold transition-colors";

const variants = {
  primary: "bg-gold text-green px-7 py-3.5 text-base rounded hover:brightness-105",
  secondary: "border border-gold text-gold px-7 py-3 text-sm rounded hover:bg-gold/10",
  ghost: "text-text-dim px-1 py-2 text-sm hover:text-gold",
} as const;

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button {...props} className={`${base} ${variants[variant]} ${className}`} />;
}

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a {...props} className={`${base} ${variants[variant]} ${className}`} />;
}
