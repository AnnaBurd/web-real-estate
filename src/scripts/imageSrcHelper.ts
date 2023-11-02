const defaults = {
  img: "/vectors/no_image.svg",
  width: 400,
  height: 300,
} as const;

export const generateImageSrc = (
  url?: string,
  width?: number,
  height?: number
) => {
  if (!url) return defaults.img;

  const adjustedWidth = width || defaults.width;
  const adjustedHeight = height || (width && width * 0.75) || defaults.height;

  return `${url}?fm=jpg&fl=progressive&fit=fill&w=${adjustedWidth}&h=${adjustedHeight}`;
};

export const generateImageSrcset = (url?: string, widths?: number[]) => {
  if (!url) return defaults.img;

  if (!widths) {
    widths = [400, 600, 800, 1000, 1200, 1400, 1600];
  }

  let srcset = widths
    .map((size) => {
      return `${url}?fm=jpg&fl=progressive&fit=fill&w=${size}&h=${
        size * 0.75
      } ${size}w`;
    })
    .join(", ");

  return srcset;
};
