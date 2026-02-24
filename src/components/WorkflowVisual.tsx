"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState, useEffect } from "react";

/**
 * WorkflowVisual — automation pipeline node map
 * 5 nodes: Trigger → Hämta data → AI-analys → Åtgärd → Klar
 * Animated data-packet pulses travel along each edge
 * Palette: warm off-white bg, orange accents, warm brown text
 */

const NODES = [
  {
    id: "trigger",
    label: "Trigger",
    sublabel: "Nytt formulär",
    accent: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "fetch",
    label: "Hämta data",
    sublabel: "Allabolag API",
    accent: false,
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true">
        <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "ai",
    label: "AI-analys",
    sublabel: "GPT-4o",
    accent: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true">
        <path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "action",
    label: "Åtgärd",
    sublabel: "Skicka rapport",
    accent: false,
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true">
        <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "done",
    label: "Klar",
    sublabel: "Notifiering",
    accent: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true">
        <path
          d="M10 2l2.4 5.2 5.6.8-4 4 .9 5.6L10 15l-4.9 2.6.9-5.6-4-4 5.6-.8L10 2z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

// ─── Animated edge with travelling packet ──────────────────────────────────

function AnimatedEdge({ delay }: { delay: number }) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex-1 relative flex items-center mx-2" style={{ minWidth: 0 }}>
      {/* Track */}
      <div
        className="w-full"
        style={{
          height: 1.5,
          background:
            "linear-gradient(90deg, rgba(212,98,43,0.15) 0%, rgba(232,131,58,0.38) 50%, rgba(212,98,43,0.15) 100%)",
          borderRadius: 1,
        }}
      />
      {/* Arrowhead */}
      <div
        style={{
          position: "absolute",
          right: -1,
          top: "50%",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "4px solid transparent",
          borderBottom: "4px solid transparent",
          borderLeft: "6px solid rgba(212,98,43,0.42)",
        }}
      />
      {/* Packet */}
      {!prefersReduced && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 7,
            height: 7,
            top: "50%",
            marginTop: -3.5,
            background: "#D4622B",
            boxShadow: "0 0 10px 3px rgba(232,131,58,0.48)",
          }}
          animate={{ left: ["2%", "92%"] }}
          transition={{
            duration: 1.6,
            delay,
            repeat: Infinity,
            repeatDelay: 1.0,
            ease: [0.4, 0, 0.55, 1],
          }}
        />
      )}
    </div>
  );
}

// ─── Node card ─────────────────────────────────────────────────────────────

function NodeCard({
  node,
  index,
  inView,
}: {
  node: (typeof NODES)[number];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ delay: index * 0.09, duration: 0.42, ease: [0.0, 0.0, 0.2, 1] }}
      style={{ width: 108, flexShrink: 0 }}
    >
      {/* Card */}
      <div
        style={{
          borderRadius: 14,
          padding: "16px 10px 14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 9,
          background: node.accent
            ? "linear-gradient(150deg, rgba(212,98,43,0.11) 0%, rgba(232,131,58,0.05) 100%)"
            : "var(--color-card-bg)",
          border: node.accent
            ? "1px solid rgba(212,98,43,0.28)"
            : "1px solid var(--color-border)",
          boxShadow: node.accent
            ? "0 4px 18px rgba(212,98,43,0.09), 0 1px 3px rgba(0,0,0,0.05)"
            : "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: node.accent ? "rgba(212,98,43,0.13)" : "rgba(58,51,48,0.06)",
            color: node.accent ? "#C85520" : "var(--color-muted)",
          }}
        >
          {node.icon}
        </div>

        {/* Text */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 650,
              color: "var(--color-text)",
              lineHeight: 1.25,
              marginBottom: 3,
            }}
          >
            {node.label}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--color-muted)", lineHeight: 1.3 }}>
            {node.sublabel}
          </div>
        </div>
      </div>

      {/* Step number */}
      <div
        style={{
          marginTop: 8,
          textAlign: "center",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: node.accent ? "#D4622B" : "var(--color-muted)",
          opacity: 0.65,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────

export default function WorkflowVisual() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full">
      {/* Node row */}
      <div className="overflow-x-auto">
        <div
          className="flex items-start mx-auto"
          style={{ minWidth: 600, maxWidth: 820, padding: "4px 0 20px" }}
        >
          {NODES.map((node, i) => (
            <div
              key={node.id}
              className="flex items-center"
              style={{ flex: i < NODES.length - 1 ? "1 1 auto" : "0 0 auto" }}
            >
              <NodeCard node={node} index={i} inView={inView} />
              {i < NODES.length - 1 && (
                <div className="flex-1 pb-9" style={{ minWidth: 0 }}>
                  <AnimatedEdge delay={i * 0.38} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="flex items-center justify-center gap-5 mt-1"
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#D4622B",
              boxShadow: "0 0 6px rgba(212,98,43,0.5)",
            }}
          />
          <span style={{ fontSize: 11.5, color: "var(--color-muted)" }}>Datapaket i rörelse</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 18,
              height: 1.5,
              background: "rgba(212,98,43,0.38)",
              borderRadius: 1,
            }}
          />
          <span style={{ fontSize: 11.5, color: "var(--color-muted)" }}>Automatiserat flöde</span>
        </div>
      </motion.div>
    </div>
  );
}
