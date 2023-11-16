import type { LandTypeOption } from "./search-filters/SearchFilters";

export const SORT_OPTIONS = [
  "Mới thêm trước",
  "Rẻ nhất trước",
  "Đắt nhất trước",
  "Nhỏ nhất trước",
  "Lớn nhất trước",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

type SearchQuery = {
  priceRange?: number[];
  sizeRange?: number[];
  typeFilters?: LandTypeOption[];
  sortBy?: SortOption;
  viewType?: "map" | "list";
};

export const saveSearchFiltersToUrl = (
  priceRange: number[],
  sizeRange: number[],
  typeFilters: LandTypeOption[],
) => {
  setSearchQuery({ priceRange, sizeRange, typeFilters });
};

export const getCurrentSearchFilters = () => {
  return getSearchQueryParams();
};

export const saveSortOptionToUrl = (sortBy: SortOption) => {
  setSearchQuery({ sortBy });
};

export const getCurrentSortOption = () => {
  return getSearchQueryParams()?.sortBy || null;
};

export const saveViewTypeToUrl = (viewType: "map" | "list") => {
  setSearchQuery({ viewType });
};

export const getCurrentViewType = () => {
  return getSearchQueryParams()?.viewType || null;
};

const setSearchQuery = ({
  priceRange,
  sizeRange,
  typeFilters,
  sortBy,
  viewType,
}: SearchQuery) => {
  // Get current query params
  const prevQueryParams = getSearchQueryParams();

  // Combine new params with current query params
  const newQueryParams = {
    ...prevQueryParams,
    ...(priceRange && { priceRange }),
    ...(sizeRange && { sizeRange }),
    ...(typeFilters && { typeFilters }),
    ...(sortBy && { sortBy }),
    ...(viewType && { viewType }),
  };

  // Generate new query string
  let newURL = `${window.location.pathname}?`;

  let isFirst = 0; // Flag to check if ampersand "&" is needed

  if (newQueryParams.priceRange)
    newURL += `${isFirst-- ? "&" : ""}price=${newQueryParams.priceRange[0]}-${
      newQueryParams.priceRange[1]
    }`;

  if (newQueryParams.sizeRange)
    newURL += `${isFirst-- ? "&" : ""}size=${newQueryParams.sizeRange[0]}-${
      newQueryParams.sizeRange[1]
    }`;

  if (newQueryParams.typeFilters)
    newURL += `${isFirst-- ? "&" : ""}filters=${encodeURIComponent(
      JSON.stringify(newQueryParams.typeFilters),
    )}`;

  if (newQueryParams.sortBy)
    newURL += `${isFirst-- ? "&" : ""}sortBy=${newQueryParams.sortBy}`;

  if (newQueryParams.viewType)
    newURL += `${isFirst-- ? "&" : ""}viewType=${newQueryParams.viewType}`;

  newURL += window.location.hash;

  // Replace current URL with new URL
  window.history.replaceState({}, "", newURL);
};

const getSearchQueryParams = () => {
  if (typeof window === "undefined") return null;

  const searchParams = new URLSearchParams(window.location.search);

  const priceRange = getRangeFilter("price", searchParams);

  const sizeRange = getRangeFilter("size", searchParams);

  const typeFiltersQuery = searchParams.get("filters");
  const typeFilters: LandTypeOption[] = typeFiltersQuery
    ? JSON.parse(decodeURIComponent(typeFiltersQuery))
    : null;

  const sortBy = searchParams.get("sortBy") as SortOption | null;

  const viewType = searchParams.get("viewType") as "map" | "list" | null;

  const params = {
    ...(priceRange && { priceRange }),
    ...(sizeRange && { sizeRange }),
    ...(typeFiltersQuery && { typeFilters }),
    ...(sortBy && { sortBy }),
    ...(viewType && { viewType }),
  };

  return params;
};

const getRangeFilter = (name: string, searchParams: URLSearchParams) => {
  const rangeStr = searchParams.get(name);

  return rangeStr
    ? rangeStr.split("-").map((value) => parseFloat(value))
    : null;
};
