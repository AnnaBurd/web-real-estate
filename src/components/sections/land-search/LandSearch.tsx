import SearchResults from "./search-results/SearchResults";
import type { Land } from "../../../model/Land";

import SearchFilter, {
  type FilterFunc,
  type LandTypeOption,
} from "./search-filters/SearchFilters";

import { useContext, useEffect, useState } from "react";
import { FavouritesContext } from "./favourites/FavouritesContext";
import {
  getCurrentSearchFilters,
  saveSearchFiltersToUrl,
} from "./searhQueryHelpers";

interface Props {
  preloadedLands: Land[];
  maxPrice: number;
  maxSize: number;
}

const getFilteredLands = (
  lands: Land[],
  priceRange: number[],
  sizeRange: number[],
  typeFilters: LandTypeOption[],
  isFavouriteLand: (slug: string) => boolean
) => {
  return (
    lands
      // Lands in price range
      .filter(
        (land) =>
          land.price &&
          land.price >= priceRange[0] * 1_000_000_000 &&
          land.price <= priceRange[1] * 1_000_000_000
      )
      // Lands in size range
      .filter(
        (land) =>
          land.area && land.area >= sizeRange[0] && land.area <= sizeRange[1]
      )
      // Favorite lands
      .filter(
        (land) =>
          !typeFilters.includes("Yêu thích") || isFavouriteLand(land.slug)
      )
      // Promoted lands
      .filter((land) => !typeFilters.includes("Khuyến khích") || land.promoted)
  );
};

const LandSearch: React.FC<Props> = ({ preloadedLands, maxPrice, maxSize }) => {
  const { isFavourite: isFavouriteLand } = useContext(FavouritesContext);

  const [filterUpdateIteration, setFilterUpdateIteration] = useState(0);
  const [resetIteration, setResetIteration] = useState(0); // Used to reset filters from child components

  const maxPriceAdjusted = Math.ceil((maxPrice / 1_000_000_000 + 1) / 10) * 10; // Price in dong -> price in ty (billion) dong, rounded up to nearest 10's
  const maxSizeAdjusted = Math.ceil(maxSize / 50_000) * 50_000;

  const lands = preloadedLands; // Can be replaced with API call

  const defaultFilters = {
    priceRange: [0, maxPriceAdjusted],
    sizeRange: [0, maxSizeAdjusted],
    typeFilters: [] as LandTypeOption[],
  };

  const { priceRange, sizeRange, typeFilters } = {
    ...defaultFilters,
    ...getCurrentSearchFilters(),
  };

  const filteredLands = getFilteredLands(
    lands,
    priceRange,
    sizeRange,
    typeFilters,
    isFavouriteLand
  );

  const handleFiltersSubmit: FilterFunc = (
    selectedPriceRange,
    selectedSizeRange,
    selectedFilterByType
  ) => {
    saveSearchFiltersToUrl(
      selectedPriceRange,
      selectedSizeRange,
      selectedFilterByType
    );

    // Trigger component re-render on search filters update as if the state has changed
    setFilterUpdateIteration((prev) => prev + 1);
  };

  return (
    <>
      <div className="w-50">
        <SearchFilter
          maxPrice={maxPriceAdjusted}
          initialPriceRange={priceRange}
          maxSize={maxSizeAdjusted}
          initialSizeRange={sizeRange}
          initialFilterByType={typeFilters}
          onSubmit={handleFiltersSubmit}
          resetIteration={resetIteration}
        />
      </div>
      <div className="p-4 pr-2  flex-1 pb-10 relative min-w-[20rem] @container/search-results">
        <SearchResults
          lands={filteredLands}
          mapUpdateIteration={filterUpdateIteration}
          onResetSearch={() => {
            setResetIteration((prev) => prev + 1);
          }}
        />
        <div
          className="h-full w-1.5 absolute mt-14 top-0 right-0 opacity-50  cursor-col-resize z-10 hidden lg:block "
          id="resize-handle"
        ></div>
      </div>
    </>
  );
};

export default LandSearch;
