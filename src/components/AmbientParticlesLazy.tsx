"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type AmbientParticles from "./AmbientParticles";

const AmbientParticlesInner = dynamic(() => import("@/components/AmbientParticles"), { ssr: false });

export default function AmbientParticlesLazy(props: ComponentProps<typeof AmbientParticles>) {
  return <AmbientParticlesInner {...props} />;
}
