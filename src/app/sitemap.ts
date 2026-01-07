import type { MetadataRoute } from "next";

const SITE_URL = "https://khyteautomations.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/cases", "/contact"];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));
}
