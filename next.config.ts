import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {},

  async redirects() {
    return [
      // ── Host normalisation lives in Vercel, NOT here ─────────────────────
      // khyte.se is canonical. Every alias — www.khyte.se, khyteteam.com,
      // khyteautomations.com and their www variants — redirects to it as a
      // permanent 308, configured per-domain in the Vercel dashboard
      // (project → Settings → Domains). Vercel applies those at the edge
      // before this app is invoked.
      //
      // Do not add host-matching rules below. A rule pointing the opposite
      // way to Vercel's own setting makes the two redirect into each other
      // in an infinite loop, which takes down every URL on the site — that
      // is exactly what happened when a www.khyte.se → khyte.se rule was
      // added here while Vercel had www set as primary.
      //
      // Path redirects are fine, and are what the rest of this list is for.

      // Retired sub-pages. Listed before the /services wildcard so the old
      // English URLs land on /tjanster in one hop instead of chaining.
      { source: "/services/audit", destination: "/tjanster", permanent: true },
      { source: "/services/custom-build", destination: "/tjanster", permanent: true },
      { source: "/tjanster/audit", destination: "/tjanster", permanent: true },
      { source: "/tjanster/custom-build", destination: "/tjanster", permanent: true },

      // English → Swedish route migration (permanent 301s)
      { source: "/services", destination: "/tjanster", permanent: true },
      { source: "/services/:path*", destination: "/tjanster/:path*", permanent: true },
      { source: "/cases", destination: "/case", permanent: true },
      { source: "/cases/:path*", destination: "/case/:path*", permanent: true },
      { source: "/about", destination: "/om-oss", permanent: true },
      { source: "/contact", destination: "/kontakt", permanent: true },
      // Legacy routes
      { source: "/automations", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
