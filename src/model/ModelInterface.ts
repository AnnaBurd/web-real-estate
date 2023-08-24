import type { Land } from "./Land";

export interface Model {
  getAllLands(): Promise<Land[]>;
  getPromotedLands(): Promise<Land[]>;
  getLandBySlug(slug: string): Promise<Land>;
  getLandsBySuggestedLands(suggestedLands: string[]): Promise<Land[]>;
}
