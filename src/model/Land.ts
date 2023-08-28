type ParagraphNode = {
  paragraph: string;
};

type BulletPointsNode = {
  bulletPoints: string[];
};

type LandLongDescriptionNode = ParagraphNode | BulletPointsNode;

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
  images?: string[];
  videos?: string[];
  suggestedLands?: string[];
};
