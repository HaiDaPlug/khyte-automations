"use client";

import dynamic from "next/dynamic";

// @ts-expect-error — archived file, KhyteMap.leaflet-archived.tsx is intentionally not compiled
const KhyteMap = dynamic(() => import("./KhyteMap"), { ssr: false });

export default function KhyteMapClient() {
  return <KhyteMap />;
}
