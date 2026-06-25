/**
 * Content-collection data access for parcels and agents.
 *
 * Replaces the Contentful-backed `Model` (src/model/ContentfulModel.ts). Pages
 * import these helpers instead of the old default-export model. The markdown
 * body is rendered in the page via `render(entry)` from astro:content, so this
 * module stays free of rendering concerns.
 */
import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type Parcel = CollectionEntry<"parcels">;
export type Agent = CollectionEntry<"agents">;

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) =>
  a.data.order - b.data.order;

/** All parcels, ordered by the `order` frontmatter field (lower first). */
export async function getAllParcels(): Promise<Parcel[]> {
  return (await getCollection("parcels")).sort(byOrder);
}

/** Parcels flagged `promoted: true` (the homepage "Available land" set). */
export async function getPromotedParcels(): Promise<Parcel[]> {
  return (await getAllParcels()).filter((p) => p.data.promoted);
}

/** A single parcel by slug (filename without extension), or undefined. */
export function getParcelBySlug(slug: string): Promise<Parcel | undefined> {
  return getEntry("parcels", slug);
}

/** Parcels for the given slugs, in the slugs' order, skipping any missing. */
export async function getParcelsBySlugs(slugs: string[]): Promise<Parcel[]> {
  const entries = await Promise.all(slugs.map((s) => getEntry("parcels", s)));
  return entries.filter((e): e is Parcel => Boolean(e));
}

/** All agents, ordered by the `order` frontmatter field. */
export async function getAllAgents(): Promise<Agent[]> {
  return (await getCollection("agents")).sort(byOrder);
}

/** Human area label, e.g. "58 ha" or "3.362 m²" (vi-VN grouping). */
export function formatArea(area: Parcel["data"]["area"]): string {
  const unit = area.unit === "m2" ? "m²" : area.unit;
  return `${area.value.toLocaleString("vi-VN")} ${unit}`;
}
