import { defineConfig } from "astro/config";
import { readdirSync } from "node:fs";
import sitemap from "@astrojs/sitemap";

/**
 * v1 → v2 route changes (see redesign):
 *  - parcels moved from bare `/<slug>` to `/parcels/<slug>`
 *  - the `/tim-dat` search + map page was dropped
 * Build 301s for every current parcel slug so old inbound links survive.
 */
const parcelSlugs = readdirSync(new URL("./src/content/parcels", import.meta.url))
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""));

const redirects = {
  "/tim-dat": "/",
  ...Object.fromEntries(parcelSlugs.map((s) => [`/${s}`, `/parcels/${s}`])),
};

// https://astro.build/config
export default defineConfig({
  site: "https://viet-land.vn",
  redirects,
  integrations: [
    sitemap({
      // The /tim-dat redirect stub and the privacy page shouldn't dilute the
      // sitemap; keep it to the real, indexable destinations.
      filter: (page) => !page.includes("/tim-dat"),
    }),
  ],
});
