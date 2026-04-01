import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {},

  async redirects() {
    return [
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
