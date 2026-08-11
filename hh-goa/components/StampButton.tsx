import type { ButtonHTMLAttributes } from "react";

/** The event site's own ticket-stub CTA: chunky yellow, dark border, slight tilt. */
export default function StampButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`-rotate-2 rounded-md border-2 border-green-dark bg-yellow px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide text-green-dark transition-transform hover:rotate-0 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}
