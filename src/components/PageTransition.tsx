"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top instantly (bypasses Lenis smooth scroll intentionally)
    window.scrollTo({ top: 0, behavior: "instant" });

    // Re-trigger fade by toggling the animation class
    const el = ref.current;
    if (!el) return;
    el.classList.remove("page-enter");
    // Force reflow to restart animation
    void el.offsetHeight;
    el.classList.add("page-enter");
  }, [pathname]);

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  );
}
