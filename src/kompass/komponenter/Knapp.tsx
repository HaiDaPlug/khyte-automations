"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primar" | "sekundar" | "diskret";
  children: ReactNode;
};

/**
 * Knapp i sajtens stil. Minsta höjd 48 px så att tryckytan håller på mobil.
 */
export default function Knapp({
  variant = "primar",
  children,
  className = "",
  ...rest
}: Props) {
  const bas =
    "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-base font-semibold " +
    "whitespace-nowrap transition-all duration-200 cursor-pointer no-underline " +
    "disabled:cursor-not-allowed";

  const varianter = {
    primar: "k-btn-primar",
    sekundar:
      "bg-transparent border border-[var(--k-border)] text-[var(--k-text)] " +
      "hover:bg-[rgba(58,51,48,0.06)]",
    diskret:
      "bg-transparent px-3 text-[var(--k-text-body)] underline underline-offset-4 " +
      "hover:text-[var(--k-text)]",
  };

  return (
    <button className={`${bas} ${varianter[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
