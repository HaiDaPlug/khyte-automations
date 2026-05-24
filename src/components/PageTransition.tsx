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
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Always scroll to top — on first render this corrects browser scroll restoration on refresh
    window.scrollTo({ top: 0, behavior: "instant" });
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

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
