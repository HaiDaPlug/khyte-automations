"use client";

import { useState, useRef } from "react";
import { homeFaqs, type FAQEntry } from "@/data/faq";


function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border border-[var(--color-border)] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-5 px-8 py-6 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-base md:text-lg font-semibold tracking-[-0.01em] text-[var(--color-text)]">
          {q}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-[var(--color-muted)]"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <path
            d="M4.5 6.75L9 11.25L13.5 6.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        style={{
          height: open ? `${contentRef.current?.scrollHeight ?? 0}px` : "0px",
          overflow: "hidden",
          transition: "height 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div ref={contentRef} className="px-8 pb-7 pt-0">
          <p className="text-[var(--color-text-body)] font-medium text-base leading-[1.7] max-w-[60ch]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({ items = homeFaqs }: { items?: FAQEntry[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map(({ q, a }) => (
        <FAQItem key={q} q={q} a={a} />
      ))}
    </div>
  );
}
