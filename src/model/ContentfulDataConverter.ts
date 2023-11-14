import * as contentful from "contentful";
import type {
  LandContentfulSchema,
  VideoAssetContentfulSchema,
} from "./ContentfulModelSchema";
import type { Land } from "./Land";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

// Type guard to check if an asset is resolved (has all the data) or unresolved (only has the id) ** experimental, not tested **
const isResolvedAsset = (
  asset:
    | contentful.UnresolvedLink<"Asset">
    | contentful.Asset<undefined, string>,
): asset is contentful.Asset<undefined, string> => {
  return asset.sys.type === "Asset";
};

// Type guard to check if a video entry is resolved (has all the data) or unresolved ** experimental, not tested **
const isResolvedVideoEntryLink = (
  entry:
    | contentful.Entry<VideoAssetContentfulSchema, undefined, string>
    | {
        sys: contentful.ResourceLink;
      },
): entry is contentful.Entry<VideoAssetContentfulSchema, undefined, string> => {
  return entry.sys.type === "Entry";
};

// Type guard to check if a Land entry is resolved (has all the data) or unresolved ** experimental, not tested **
const isResolvedLandEntryLink = (
  entry:
    | contentful.Entry<LandContentfulSchema, undefined, string>
    | { sys: contentful.ResourceLink },
): entry is contentful.Entry<LandContentfulSchema, undefined, string> => {
  return entry.sys.type === "Entry";
};

// Helper function to convert a title into a slug (for example, "Hello World" -> "hello-world") (at the time of writing the Contentful CMS does not have functionality to generate slugs automatically)
const titleToSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(
      /[^a-z0-9_,àáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ ]/gu,
      "",
    )
    .replaceAll(" ", "-");
};

export const entryToLand = (
  entry: contentful.Entry<LandContentfulSchema, undefined, string>,
): Land => {
  return {
    title: entry.fields.title,
    slug: titleToSlug(entry.fields.title),
    promoted: entry.fields.promoted,
    tag: entry.fields.tag,
    briefDescription: entry.fields.briefDescription,
    longDescriptionHtml: documentToHtmlString(entry.fields.longDescription, {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node, next) => {
          return `<p class=" mb-3">${next(node.content)}</p>`;
        },
        [BLOCKS.UL_LIST]: (node, next) => {
          return `<ul class="list-disc">${next(node.content)}</ul>`;
        },
        [BLOCKS.LIST_ITEM]: (node, next) => {
          return `<li class="mb-3 ml-16">${next(node.content)}</li>`;
        },
      },
    }),
    coords: entry.fields.location
      ? [entry.fields.location.lat, entry.fields.location.lon]
      : undefined,
    area: entry.fields.area,
    faceSideLength: entry.fields.faceSideLength,
    papers: entry.fields.papers,
    price: entry.fields.price,
    link: entry.fields.link,
    images: entry.fields.images?.map((img, i) => {
      if (!isResolvedAsset(img)) throw new Error("Image Asset is not resolved");

      return {
        kind: "image",
        title: `Photo ${i + 1} of ${entry.fields.title || "land"}`,
        url: img.fields.file?.url!,
        originalSize: {
          width: img.fields.file?.details?.image?.width!,
          height: img.fields.file?.details?.image?.height!,
        },
      };
    }),
    videos: entry.fields.videofiles?.map((videoEntry) => {
      if (!isResolvedVideoEntryLink(videoEntry))
        throw new Error("Video Entry is not resolved");

      const videoFile = videoEntry.fields.video;
      const videoThumbnailImage = videoEntry.fields.thumbnail;

      if (!isResolvedAsset(videoFile) || !isResolvedAsset(videoThumbnailImage))
        throw new Error("Video Asset is not resolved");

      return {
        kind: "video",
        url: videoFile.fields.file?.url!,
        thumbnail: videoThumbnailImage.fields.file?.url!,
        originalSize: {
          width: videoThumbnailImage.fields.file?.details.image?.width!,
          height: videoThumbnailImage.fields.file?.details.image?.height!,
        },
      };
    }),
    suggestedLands: entry.fields.suggestedLands?.map((landEntry) => {
      if (!isResolvedLandEntryLink(landEntry))
        throw new Error("Land Entry is not resolved");

      return titleToSlug(landEntry.fields.title);
    }),
  };
};
