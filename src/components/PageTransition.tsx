"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Disable browser scroll restoration immediately — prevents the flash where the browser
// jumps to the saved scroll position before our JS can correct it on refresh.
if (typeof window !== "undefined") {
  history.scrollRestoration = "manual";
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // On first render: scrollRestoration="manual" already keeps us at top
    }

    // Route change — scroll to top and re-trigger fade
    window.scrollTo({ top: 0, behavior: "instant" });

    const el = ref.current;
    if (!el) return;
    el.classList.remove("page-enter");
    void el.offsetHeight; // force reflow to restart animation
    el.classList.add("page-enter");
  }, [pathname]);

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  );
}
