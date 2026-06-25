import { defineCollection, z } from "astro:content";

/**
 * Parcels — one markdown file per land lot (src/content/parcels/<slug>.md).
 * Replaces the former Contentful "land" content type. The markdown body holds
 * the long description (was Contentful RichText); frontmatter holds everything
 * structured. Images are co-located under src/assets/parcels/<slug>/ and
 * optimized by astro:assets at build time.
 */
const parcels = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      // --- Identity ---
      title: z.string(),
      // Short human location label shown on cards, e.g. "Bà Rịa", "Châu Đức".
      location: z.string(),
      // Controls ordering of the curated list on the homepage (lower = first).
      order: z.number().default(99),
      // Show in the homepage "Available land opportunities" section.
      promoted: z.boolean().default(false),

      // --- Trust / legal framing (new in v2) ---
      // Drives the verification badge on the card.
      verification: z
        .enum(["red-book", "pending", "planning"])
        .default("pending"),
      // Optional positioning chip, e.g. "Best price", "Premium location".
      tag: z.string().optional(),

      // --- Facts ---
      area: z.object({
        value: z.number(),
        unit: z.enum(["m2", "ha", "sao"]).default("m2"),
      }),
      faceSideLength: z.number().optional(),
      // Free-form because v2 advertises ranges, e.g. "4.2 tỷ–4.6 tỷ".
      priceRange: z.string(),
      negotiable: z.boolean().default(true),
      coords: z.tuple([z.number(), z.number()]).optional(),

      // --- Selling points shown as bullets on the card/detail page ---
      briefDescription: z.string().optional(),
      sellingPoints: z.array(z.string()).default([]),

      // --- Lead capture: pre-filled Zalo deep-link message for this parcel ---
      zaloMessage: z.string(),

      // --- Media ---
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string().optional(),
          }),
        )
        .default([]),
      // Unlisted YouTube id (facade-embedded). Self-hosted v1 videos must be
      // re-uploaded to YouTube manually — see migration report.
      youtubeId: z.string().optional(),

      // Slugs of related parcels (cross-sell strip).
      suggestedParcels: z.array(z.string()).default([]),
    }),
});

/**
 * Agents — replaces the Contentful "agent" content type.
 * v2 contact is Zalo + phone only (no WhatsApp); facebook kept optional.
 */
const agents = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      position: z.string(),
      order: z.number().default(99),
      photo: image().optional(),
      phone: z.string().optional(),
      zalo: z.string().optional(),
      facebook: z.string().optional(),
    }),
});

export const collections = { parcels, agents };
