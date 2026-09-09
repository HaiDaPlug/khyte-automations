import { ReactNode } from "react";

/**
 * Full-bleed dark band with the shared grain overlay.
 * Used to break the light page rhythm on the homepage and /tjanster.
 */
export default function EspressoBand({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full relative overflow-hidden bg-[#1B1613] ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/noise.webp')",
          backgroundSize: "128px 128px",
          opacity: 0.055,
          mixBlendMode: "screen",
        }}
      />
      {children}
    </div>
  );
}
