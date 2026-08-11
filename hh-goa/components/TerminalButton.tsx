import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-transform active:scale-[0.98]";

const variants = {
  primary: "bg-amber text-bg px-6 py-3.5 text-base hover:brightness-110",
  secondary: "border border-amber-dim text-amber px-6 py-3 text-sm hover:border-amber",
  ghost: "text-text-dim px-2 py-2 text-sm hover:text-amber",
} as const;

type Variant = keyof typeof variants;

function bracket(children: React.ReactNode, variant: Variant) {
  if (variant === "ghost") return children;
  return (
    <>
      <span aria-hidden>[</span>
      {children}
      <span aria-hidden>]</span>
    </>
  );
}

export function TerminalButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {bracket(children, variant)}
    </button>
  );
}

export function TerminalLinkButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a {...props} className={`${base} ${variants[variant]} ${className}`}>
      {bracket(children, variant)}
    </a>
  );
}
