import type { LandTypeOption } from "./search-filters/SearchFilters";

export const saveSearchFiltersToUrl = (
  priceRange: number[],
  sizeRange: number[],
  typeFilters: LandTypeOption[]
) => {
  const newURL = `${window.location.pathname}?price=${priceRange[0]}-${
    priceRange[1]
  }&size=${sizeRange[0]}-${sizeRange[1]}&filters=${encodeURIComponent(
    JSON.stringify(typeFilters)
  )}${window.location.hash}`;

  window.history.replaceState({}, "", newURL);
};

export const getCurrentSearchFilters = () => {
  if (typeof window === "undefined") return null;

  const searchParams = new URLSearchParams(window.location.search);

  const priceRange = getRangeFilter("price", searchParams);

  const sizeRange = getRangeFilter("size", searchParams);

  const typeFilters: LandTypeOption[] = JSON.parse(
    decodeURIComponent(searchParams.get("filters") || "[]")
  );

  const filters = {
    ...(priceRange && { priceRange }),
    ...(sizeRange && { sizeRange }),
    typeFilters,
  };

  return filters;
};

const getRangeFilter = (name: string, searchParams: URLSearchParams) => {
  const rangeStr = searchParams.get(name);

  return rangeStr
    ? rangeStr.split("-").map((value) => parseFloat(value))
    : null;
};
