type ParagraphNode = {
  paragraph: string;
};

type BulletPointsNode = {
  bulletPoints: string[];
};

type LandLongDescriptionNode = ParagraphNode | BulletPointsNode;

export type ImageAsset = {
  kind: "image";
  title: string;
  url: string;
  originalSize: { width: number; height: number };
};

export type VideoAsset = {
  kind: "video";
  url: string;
  thumbnail: string;
  originalSize: { width: number; height: number };
};

export type Land = {
  id?: string;
  slug: string;
  title?: string;
  promoted?: boolean;
  tag?: string;
  briefDescription?: string;
  longDescription?: LandLongDescriptionNode[];
  coords?: [number, number];
  address?: string;
  area?: number;
  faceSideLength?: number;
  papers?: string;
  price?: number;
  link?: string;
  images?: ImageAsset[];
  videos?: VideoAsset[];
  suggestedLands?: string[];
};
