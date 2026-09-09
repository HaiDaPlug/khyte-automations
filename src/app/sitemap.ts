import type { MetadataRoute } from "next";
import { cases } from "@/data/cases";

const SITE_URL = "https://khyte.se";

const staticRoutes = [
  "",
  "/tjanster",
  "/case",
  "/om-oss",
  "/kontakt",
  "/integritetspolicy",
  "/villkor",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Case detail pages are generated from the same data that renders them, so a
  // new case is indexed without anyone remembering to touch this file.
  const routes = [...staticRoutes, ...cases.map((c) => `/case/${c.slug}`)];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));
}
