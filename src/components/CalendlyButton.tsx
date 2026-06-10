"use client";

import { ReactNode } from "react";
import { useCalendly } from "./CalendlyContext";

interface CalendlyButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "warm";
  className?: string;
}

export default function CalendlyButton({
  children,
  variant = "primary",
  className = "",
}: CalendlyButtonProps) {
  const { openCalendly } = useCalendly();

  const baseStyles =
    "inline-flex h-12 px-8 rounded-full text-base font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer items-center justify-center active:scale-[0.98] no-underline";

  const variantStyles = {
    primary: "btn-cta",
    secondary:
      "bg-transparent border border-[rgba(58,51,48,0.20)] text-[#3A3330] hover:bg-[rgba(58,51,48,0.06)]",
    warm: "btn-cta",
  };

  return (
    <button
      onClick={openCalendly}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
