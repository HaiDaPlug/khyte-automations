"use client";

import { ReactNode } from "react";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

interface CalendlyButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "warm";
  className?: string;
}

const CALENDLY_URL = "https://calendly.com/hai-khyteteam/30min";

export default function CalendlyButton({
  children,
  variant = "primary",
  className = "",
}: CalendlyButtonProps) {
  const baseStyles =
    "inline-flex h-12 px-8 rounded-md text-base font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer items-center justify-center active:scale-[0.98] no-underline";

  const variantStyles = {
    primary: "bg-[#D4622B] text-white hover:bg-[#C0541F]",
    secondary:
      "bg-transparent border border-[rgba(58,51,48,0.20)] text-[#3A3330] hover:bg-[rgba(58,51,48,0.06)]",
    warm:
      "bg-[var(--color-warm-accent)] text-[var(--color-warm-ink)] hover:bg-[var(--color-warm-accent-hover)]",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
