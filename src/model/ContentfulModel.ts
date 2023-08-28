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
import type { Model } from "./ModelInterface";

class ContentfulModel implements Model {
  private lands: Land[] = [];
  private promiseReady;
  private client: contentful.ContentfulClientApi<undefined>;
  private geoapifyClientUrl: string;

  constructor(
    contentfulSpaceId: string,
    contentfulEnvironmentName: string,
    contentfulAPIKey: string,
    geoapifyAPIKey: string
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
      const entries = await this.client.getEntries({ content_type: "land" });

      // Convert the Contentful data into application data format (for easier usage, because Contentful-generated JSON is rather hard to navigate through)
      const lands: Land[] = entries.items.map((item) => {
        const title = item.fields.title as string;
        const slug = ContentfulModel.titleToSlug(title);

        const longDescription = item.fields.longDescription
          ? (item.fields.longDescription as { content: any }).content.flatMap(
              (contentNode: any) => {
                if (
                  contentNode.nodeType === "paragraph" &&
                  contentNode.content[0].value
                ) {
                  return { paragraph: contentNode.content[0].value };
                }

                if (contentNode.nodeType === "unordered-list") {
                  return {
                    bulletPoints: contentNode.content.map(
                      (li: any) => li.content[0].content[0].value
                    ),
                  };
                }

                return [];
              }
            )
          : [];

        const coords: [number, number] | undefined = item.fields.location
          ? [
              (item.fields.location as any).lat,
              (item.fields.location as any).lon,
            ]
          : undefined;

        const images = !item.fields.images
          ? []
          : (item.fields.images as any[]).map((entry) => {
              return entry.fields.file.url as string;
            });

        const videos = !item.fields.videos
          ? []
          : (item.fields.videos as any[]).map((entry) => {
              return entry.fields.file.url as string;
            });

        const suggestedLands = !item.fields.suggestedLands
          ? []
          : (item.fields.suggestedLands as any[]).map((entry) => {
              const title = entry.fields.title as string;
              const slug = ContentfulModel.titleToSlug(title);

              return slug;
            });

        return {
          title,
          slug,
          promoted: item.fields.promoted as boolean,
          tag: item.fields.tag ? (item.fields.tag as string) : "",
          briefDescription: item.fields.briefDescription
            ? (item.fields.briefDescription as string)
            : "",
          longDescription,
          coords,
          area: item.fields.area ? (item.fields.area as number) : 0,
          faceSideLength: item.fields.faceSideLength
            ? (item.fields.faceSideLength as number)
            : 0,
          papers: item.fields.papers ? (item.fields.papers as string) : "",
          price: item.fields.price ? (item.fields.price as number) : 0,
          link: item.fields.link ? (item.fields.link as string) : "",
          images,
          videos,
          suggestedLands,
        };
      });

      // Contentful does not allow to store address, so use another API to get it from the coordinates
      // await this.loadLandsAddresses(lands); // TODO: uncomment this line to enable fetching addresses

      // Update the application data and state
      this.lands = lands;

      console.log("📖 ContentfulModel: data loaded successfully ");
    } catch (error) {
      console.log("📖💥 ContentfulModel: error loading data: ", error);
    }

    return this;
  }

  // Fetch addresses for the lands from the Geoapify API
  private async loadLandsAddresses(lands: Land[]) {
    console.log("🌍 ContentfulModel: fetching lands addresses ");

    // 0. Prepare request data
    const inputs = lands
      .filter((land) => land.coords)
      .map((land) => ({
        id: land.slug,
        params: { lat: land.coords![0], lon: land.coords![1] },
      }));

    // Send request (batch of coordinates to addresses)
    // Reference https://apidocs.geoapify.com/samples/batch/batch-call-javascript/

    // 1. Ask Geoapify API to convert coordinates to addresses (takes time, while pending returns 202, when done returns 200)
    let response = await fetch(this.geoapifyClientUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        api: "/v1/geocode/reverse",
        params: {
          lang: "vi",
        },
        inputs,
      }),
    });

    // 2. Get id of the batch (generated by Geoapify API and allows to check the status of the batch)
    let batchId = "";
    if (response.status === 202) {
      const body = await response.json();
      batchId = body.id;
    }

    // 3. Wait until results are ready
    let attempt = 0;
    while (response.status === 202 && attempt < 10) {
      attempt++;
      console.log(
        `🌍 Geoapify - waiting for the addresses, attempt #${attempt}`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait a second

      response = await fetch(this.geoapifyClientUrl + `&id=${batchId}`);
    }

    // 4. Get the results
    if (response.status !== 200)
      throw new Error(
        `🌍 Geoapify - failed to fetch addresses after ${attempt} attempts: ${response.status}`
      );

    const jsonResults = await response.json();

    // 5. Add addresses to the lands
    jsonResults.results.forEach((result: any) => {
      const land = lands.find((land) => land.slug === result.id);

      const address = result.result.features[0].properties.formatted;

      const adjustedAddress = (address as string).replace(", Việt Nam", "");

      if (land) land.address = adjustedAddress;
    });

    return lands;
  }

  // Helper function to convert a title into a slug (for example, "Hello World" -> "hello-world") (at the time of writing the Contentful CMS does not have functionality to generate slugs automatically)
  static titleToSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(
        /[^a-z0-9_,àáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ ]/gu,
        ""
      )
      .replaceAll(" ", "-");
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
  async getLandsBySuggestedLands(suggestedLands: string[]): Promise<Land[]> {
    throw new Error("Method not implemented.");
  }
}

const applicationDataModel = await new ContentfulModel(
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_DELIVERY_TOKEN,
  GEOAPIFY_KEY
).ready(); // Instantiate the model and wait until all data is loaded

export default applicationDataModel;
