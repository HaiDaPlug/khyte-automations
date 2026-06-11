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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // First render — scroll position is at top (set by inline script); no restoration needed
    }

    // Route change — scroll to top and re-trigger fade
    window.scrollTo({ top: 0, behavior: "instant" });

    const el = ref.current;
    if (!el) return;
    el.classList.remove("page-enter");
    void el.offsetHeight;
    el.classList.add("page-enter");
  }, [pathname]);

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  );
}
