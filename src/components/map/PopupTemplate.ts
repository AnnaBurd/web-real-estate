import type { Land } from "../../model/Land";
import { generateImageSrc } from "../../scripts/imageSrcHelper";

const popupTemplate = /*html*/ `<a
href=%LAND_URL%
target="_blank"
rel="noopener noreferrer"
class="bg-white rounded-xl overflow-hidden flex flex-col h-fit w-44 min-w-max md:max-w-sm tabbable p-2.5 shadow-sm !text-[--color-text]"
>
<div class="w-full h-20 rounded-xl overflow-hidden shadow-md">
  <img
    loading="lazy"
    alt=%LAND_TITLE%
    src=%LAND_IMAGE_SRC%
    class="w-full h-full object-cover"
  />
</div>

<div class="text-base font-semibold tracking-tight leading-tight mt-2">
  %LAND_TITLE%
</div>

<div class="mt-0.5">
  <span
    class="text-[--color-accent] text-base md:text-xl xl:text-xl font-normal md:font-light tracking-tighter leading-tight"
    >%LAND_PRICE%</span>
  <span
    class="text-[--color-accent] text-sm font-medium xl:font-normal xl:text-sm"
    > tỷ </span>
  <span class="bg-[--color-text] w-[1px] h-5 xl:h-5 inline-block -mb-1 ml-1 mr-1.5 opacity-20"></span>
  <span class="opacity-90 tracking-tighter text-xs">
    %LAND_AREA% m<sup>2</sup></span>
</div>
</a>`;

export const getPopupMarkup = (land: Land) => {
  return popupTemplate
    .replaceAll("%LAND_URL%", land.slug)
    .replaceAll("%LAND_TITLE%", land.title || "Đất nền")
    .replaceAll("%LAND_IMAGE_SRC%", generateImageSrc(land.images?.[0].url))
    .replaceAll("%LAND_PRICE%", (land?.price || 0) / 1000000000 + "")
    .replaceAll(
      "%LAND_AREA%",
      land.area?.toLocaleString().replace(/,/g, " ") || ""
    );
};
