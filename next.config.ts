import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {},

  async redirects() {
    return [
      // ── Host normalisation ───────────────────────────────────────────────
      // khyte.se is the canonical domain. Anything served on the old
      // khyteautomations.com (or a www variant) is a duplicate of the whole
      // site — without this, Google can index both and split the ranking
      // signal across them.
      //
      // Host rules run first so the domain is normalised before the path
      // rules below. A legacy domain AND a legacy path (e.g.
      // khyteautomations.com/services) therefore takes two hops, which is
      // fine — Google follows redirect chains this short without issue.
      //
      // These are inert if the domain is not attached to the deployment, so
      // they are safe to keep either way.
      {
        source: "/:path*",
        has: [{ type: "host", value: "khyteautomations.com" }],
        destination: "https://khyte.se/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.khyteautomations.com" }],
        destination: "https://khyte.se/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.khyte.se" }],
        destination: "https://khyte.se/:path*",
        permanent: true,
      },

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
