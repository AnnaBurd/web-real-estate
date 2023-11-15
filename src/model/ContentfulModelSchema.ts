import * as contentful from "contentful";

export type VideoAssetContentfulSchema = {
  contentTypeId: "video";
  fields: {
    thumbnail: contentful.EntryFieldTypes.AssetLink;
    video: contentful.EntryFieldTypes.AssetLink;
  };
};

export type LandContentfulSchema = {
  contentTypeId: "land";
  fields: {
    title: contentful.EntryFieldTypes.Text;
    promoted: contentful.EntryFieldTypes.Boolean;
    tag: contentful.EntryFieldTypes.Symbol;
    briefDescription: contentful.EntryFieldTypes.Symbol;
    longDescription: contentful.EntryFieldTypes.RichText;
    location: contentful.EntryFieldTypes.Location;
    area: contentful.EntryFieldTypes.Number;
    faceSideLength: contentful.EntryFieldTypes.Number;
    papers: contentful.EntryFieldTypes.Symbol;
    price: contentful.EntryFieldTypes.Number;
    link: contentful.EntryFieldTypes.Symbol;
    images: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    suggestedLands: contentful.EntryFieldTypes.Array<
      contentful.EntryFieldTypes.EntryResourceLink<LandContentfulSchema>
    >;
    videofiles: contentful.EntryFieldTypes.Array<
      contentful.EntryFieldTypes.EntryResourceLink<VideoAssetContentfulSchema>
    >;
  };
};

export type AgentContentfulSchema = {
  contentTypeId: "agent";
  fields: {
    name: contentful.EntryFieldTypes.Text;
    positionName: contentful.EntryFieldTypes.Text;
    profilePhoto?: contentful.EntryFieldTypes.AssetLink;
    phoneNumber?: contentful.EntryFieldTypes.Symbol;
    facebookUrl?: contentful.EntryFieldTypes.Symbol;
    zaloUrl?: contentful.EntryFieldTypes.Symbol;
  };
};
