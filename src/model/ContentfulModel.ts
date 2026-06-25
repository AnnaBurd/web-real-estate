import * as contentful from "contentful";

const createClientFunc = contentful.createClient
  ? contentful.createClient
  : (contentful as any).default.createClient;

// Import environment variables from .env file (Astro automatically loads them into import.meta.env)
const CONTENTFUL_DELIVERY_TOKEN = import.meta.env.CONTENTFUL_DELIVERY_TOKEN;
const CONTENTFUL_PREVIEW_TOKEN = import.meta.env.CONTENTFUL_PREVIEW_TOKEN;
const CONTENTFUL_SPACE_ID = import.meta.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ENVIRONMENT = import.meta.env.CONTENTFUL_ENVIRONMENT;
const GEOAPIFY_KEY = import.meta.env.GEOAPIFY_KEY;

import type { Land } from "./Land";
import type { Model } from "./Model";
import type {
  AgentContentfulSchema,
  LandContentfulSchema,
} from "./ContentfulModelSchema";
import { entryToAgent, entryToLand } from "./ContentfulDataConverter";
import { loadLandsAddresses } from "./ReverseGeocoder";
import type { Agent } from "./Agent";

class ContentfulModel implements Model {
  private lands: Land[] = [];
  private promiseReady;
  private client: contentful.ContentfulClientApi<undefined>;
  private geoapifyClientUrl: string;

  constructor(
    contentfulSpaceId: string,
    contentfulEnvironmentName: string,
    contentfulAPIKey: string,
    geoapifyAPIKey: string,
  ) {
    // Instantiate client for the Contentful CMS
    this.client = createClientFunc({
      space: contentfulSpaceId,
      environment: contentfulEnvironmentName,
      accessToken: contentfulAPIKey,
    });

    // Set up keys and urls for the Geoapify API
    this.geoapifyClientUrl = `https://api.geoapify.com/v1/batch?apiKey=${geoapifyAPIKey}`;

    // Load data needed to generate application pages
    // Note: the promise ready + async init() pattern is used to make sure that the data is loaded before the application starts
    this.promiseReady = this.loadLands();
  }

  ready() {
    return this.promiseReady;
  }

  // Fetch all lands data from the Contentful CMS and third-party APIs, convert it into application data format and update the application state
  private async loadLands(): Promise<this> {
    try {
      console.log("📖 ContentfulModel: loading lands data ");

      // Fetch data from the Contentful API
      const entries = await this.client.getEntries<LandContentfulSchema>({
        content_type: "land",
      });

      // Transform the Contentful data into application data format (for easier usage, because Contentful-generated JSON is rather hard to navigate through)
      const loadedLands = entries.items.map(entryToLand);

      // Update the application data and state first, so a failure of the
      // optional address lookup below can never wipe out the land pages.
      this.lands = loadedLands;

      // Contentful does not allow to store address, so use another API to get it from the coordinates.
      // This is best-effort: if Geoapify is slow/unavailable, lands still render without an address.
      try {
        await loadLandsAddresses(loadedLands, this.geoapifyClientUrl);
      } catch (geoError) {
        console.log(
          "🌍⚠️ ContentfulModel: address lookup failed, building lands without addresses: ",
          geoError,
        );
      }

      console.log("📖 ContentfulModel: data loaded successfully ");
    } catch (error) {
      console.log("📖💥 ContentfulModel: error loading data: ", error);
    }

    return this;
  }

  // Implement the Model interface - APIs to be used by the application
  async getAllLands(): Promise<Land[]> {
    return this.lands;
  }
  async getPromotedLands(): Promise<Land[]> {
    return this.lands.filter((land) => land.promoted);
  }
  async getLandBySlug(slug: string): Promise<Land> {
    throw new Error("Method not implemented.");
  }
  async getLandsBySlugs(slugs: string[]): Promise<Land[]> {
    // Return the lands in order of the slugs array
    return slugs.map((slug) => this.lands.find((land) => land.slug === slug)!);
  }

  async getAllAgents(): Promise<Agent[]> {
    // Fetch data from the Contentful API
    const entries = await this.client.getEntries<AgentContentfulSchema>({
      content_type: "agent",
    });

    // Transform into simpler form for futher usage
    return entries.items.map(entryToAgent);
  }
}

const applicationDataModel = await new ContentfulModel(
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_DELIVERY_TOKEN,
  GEOAPIFY_KEY,
).ready(); // Instantiate the model and wait until all data is loaded

export default applicationDataModel;
