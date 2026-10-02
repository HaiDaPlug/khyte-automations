import type { MetadataRoute } from "next";
import { cases } from "@/data/cases";
import { services } from "@/data/services";

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
  // No lastModified: stamping every URL with the build time tells Google the
  // whole site changed on each deploy, and it stops trusting the field. Add it
  // back per page only once real edit dates are tracked.

  // Service and case pages are generated from the same data that renders them,
  // so a new one is indexed without anyone remembering to touch this file.
  const routes = [
    ...staticRoutes,
    ...services.map((s) => `/tjanster/${s.slug}`),
    ...cases.map((c) => `/case/${c.slug}`),
  ];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));
}
