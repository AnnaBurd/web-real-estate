import type { Land } from "./Land";

export interface Model {
  getAllLands(): Promise<Land[]>;
  getPromotedLands(): Promise<Land[]>;
  getLandBySlug(slug: string): Promise<Land>;
  getLandsBySlugs(slugs: string[]): Promise<Land[]>;
}
