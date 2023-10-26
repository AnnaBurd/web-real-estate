import SearchResults from "./SearchResults";
import type { Land } from "../../../model/Land";
import SearchFilter, {
  type FilterFunc,
  type LandTypeOption,
} from "./search-filters/SearchFilters";

import "./LandSearch.sass";
import { useState } from "react";

interface Props {
  preloadedLands: Land[];
  maxPrice: number;
  maxSize: number;
  children?: React.ReactNode;
}

const LandSearch: React.FC<Props> = ({ preloadedLands, maxPrice, maxSize }) => {
  console.log("Preloaded lands:", preloadedLands.length, maxPrice, maxSize);

  const maxPriceAdjusted = Math.ceil((maxPrice / 1_000_000_000 + 1) / 10) * 10; // Price in dong -> price in ty (billion) dong, rounded up to nearest 10's

  const maxSizeAdjusted = Math.ceil(maxSize / 50_000) * 50_000;

  const [filterIteration, setFilterIteration] = useState(0); // Used to force re-render of SearchResults when filters change

  // TODO: Read the query params from the URL (e.g. ?price=1000), but only on the client side (i.e. not during SSR)
  const readFiltersFromURL = () => {
    if (typeof window === "undefined")
      return {
        priceRange: [0, maxPriceAdjusted],
        sizeRange: [0, maxSizeAdjusted],
        filterByType: [] as LandTypeOption[],
      }; // Don't read from URL during SSR

    const queryParams = window.location.search;

    const searhParams = new URLSearchParams(queryParams);

    const priceRange = searhParams
      .get("price")
      ?.split("-")
      .map((str) => +str) ?? [0, maxPriceAdjusted];
    const sizeRange = searhParams
      .get("size")
      ?.split("-")
      .map((str) => +str) ?? [0, maxSizeAdjusted];

    const filterByType: LandTypeOption[] = JSON.parse(
      decodeURIComponent(searhParams.get("filters") || "[]")
    );

    return {
      priceRange,
      sizeRange,
      filterByType,
    };
  };

  const handleFiltersSubmit: FilterFunc = (
    selectedPriceRange,
    selectedSizeRange,
    selectedFilterByType
  ) => {
    const newURL = `${window.location.pathname}?price=${
      selectedPriceRange[0]
    }-${selectedPriceRange[1]}&size=${selectedSizeRange[0]}-${
      selectedSizeRange[1]
    }&filters=${encodeURIComponent(JSON.stringify(selectedFilterByType))}${
      window.location.hash
    }`;

    window.history.replaceState({}, "", newURL);

    setFilterIteration((prev) => prev + 1);
  };

  //   // window.addEventListener('popstate', () => {
  //   //   // Handle URL changes here
  //   // });
  // }

  const { priceRange, sizeRange, filterByType } = readFiltersFromURL();

  console.log(
    "Got filters to actually use:",
    priceRange,
    sizeRange,
    filterByType
  );

  const filteredLands = preloadedLands
    .filter(
      (land) =>
        land.price &&
        land.price >= priceRange[0] * 1_000_000_000 &&
        land.price <= priceRange[1] * 1_000_000_000
    )
    .filter(
      (land) =>
        land.area && land.area >= sizeRange[0] && land.area <= sizeRange[1]
    );

  return (
    <>
      <div className="w-50">
        <SearchFilter
          maxPrice={maxPriceAdjusted}
          initialPriceRange={priceRange}
          maxSize={maxSizeAdjusted}
          initialSizeRange={sizeRange}
          onSubmit={handleFiltersSubmit}
        />
      </div>
      <div className="p-4 pr-2 mr-2.5 flex-1 pb-10">
        <SearchResults lands={filteredLands} />
      </div>
    </>
  );
};

export default LandSearch;
