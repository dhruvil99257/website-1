import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/credits"];
  return pages.flatMap((page) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.3,
      alternates: {
        languages: Object.fromEntries(locales.map((x) => [x, `${site.url}/${x}${page}`])),
      },
    })),
  );
}
