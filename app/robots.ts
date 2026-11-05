import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { HONEYPOT_PATHS } from "@/lib/security/honeypots";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/history",
          "/offline",
          "/quick-action",
          "/s/",
          // Honeypots (PRD §21.3): well-behaved crawlers stay out; only scanners hit them.
          ...HONEYPOT_PATHS,
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
