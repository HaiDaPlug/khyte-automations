import type { MetadataRoute } from "next";

const SITE_URL = "https://khyte.se";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/internal/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
