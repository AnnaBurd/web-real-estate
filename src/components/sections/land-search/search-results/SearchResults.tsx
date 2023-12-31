import { useContext, useEffect, useRef, useState } from "react";

import type { Land } from "../../../../model/Land";
import Card from "./card/Card";
import Dropdown from "../../../ui/Dropdown";

import type { MapView } from "../../../map/MapView";

import "./SearchResults.sass";
import { FavouritesContext } from "../favourites/FavouritesContext";
import EmptySearch from "./empty-search/EmptySearch";
import SortIcon from "./SortIcon";
import ViewSwitch from "./ViewSwitch";
import FilterIcon from "../search-filters/FilterIcon";
import {
  type SortOption,
  SORT_OPTIONS,
  saveSortOptionToUrl,
  getCurrentSortOption,
  getCurrentViewType,
  saveViewTypeToUrl,
} from "../searhQueryStateManager";

interface Props {
  lands: Land[];
  mapUpdateIteration: number;

  onResetSearch: () => void;
  onOpenFilters: () => void;
}

const sortLands = (lands: Land[], sortOption: SortOption | null) => {
  if (!sortOption || sortOption === "Mới thêm trước") return lands;

  if (sortOption === "Rẻ nhất trước")
    return lands.toSorted((a, b) => a.price! - b.price!);

  if (sortOption === "Đắt nhất trước")
    return lands.toSorted((a, b) => b.price! - a.price!);

  if (sortOption === "Nhỏ nhất trước")
    return lands.toSorted((a, b) => a.area! - b.area!);

  if (sortOption === "Lớn nhất trước")
    return lands.toSorted((a, b) => b.area! - a.area!);

  return lands;
};

const SearchResults: React.FC<Props> = ({
  lands,
  mapUpdateIteration,
  onResetSearch,
  onOpenFilters,
}) => {
  const [isMapShown, setIsMapShown] = useState(getCurrentViewType() === "map"); // Show list view by default on small screens, but allow to switch to map view
  const handleViewSwitchToggle = () => {
    // Toggle list visibility
    setIsMapShown((prev) => !prev);

    // Toggle map visibility
    mapViewWrapperRef.current?.classList.toggle("max-lg:invisible");
    mapViewWrapperRef.current?.classList.toggle("max-lg:opacity-0");

    // Update url query params to reflect the new view type
    saveViewTypeToUrl(isMapShown ? "list" : "map");
  };

  const [sortOption, setSortOption] = useState<SortOption | null>(
    getCurrentSortOption(),
  ); // By default show newly added lands first

  const handleSortOptionChange = (option: SortOption | null) => {
    setSortOption(option);

    // Update url query params to reflect the new sort option
    if (option) saveSortOptionToUrl(option);
  };

  const sortedLands = sortLands(lands, sortOption);

  // Reference to map-view element (used to show search results on map)
  const mapViewRef = useRef<MapView | null>(null);
  const mapViewWrapperRef = useRef<HTMLDivElement | null>(null);

  // Get reference to map-view element (used to show location markers)
  useEffect(() => {
    mapViewRef.current = document.querySelector("map-view") as MapView;
    mapViewWrapperRef.current = document.querySelector(
      "#resizable-map-wrapper",
    ) as HTMLDivElement;

    // First render of map-view element
    rerenderMapMarkers(sortedLands);

    if (sortedLands.length > 0)
      mapViewRef.current?.focusOnPopupMarker(sortedLands[0].title!);

    // Sync map-view element visibility with the current view type (relevant for mobile devices)

    if (isMapShown) {
      // Toggle map visibility
      mapViewWrapperRef.current?.classList.toggle("max-lg:invisible");
      mapViewWrapperRef.current?.classList.toggle("max-lg:opacity-0");
    }
  }, []);

  const {
    isFavourite: isFavouriteLand,
    registerToggleCallback: registerFavouriteToggleCallback,
  } = useContext(FavouritesContext);

  // Update map each time sort order or sort results change
  const rerenderMapMarkers = (lands: Land[]) => {
    const favourites = sortedLands
      .filter((land) => isFavouriteLand(land.slug!))
      .map((land) => land.title!);

    mapViewRef.current?.renderPopupMarkers(
      lands.filter((land) => land.coords),
      favourites,
    );
  };
  rerenderMapMarkers(sortedLands);

  // Focus map on the first item from the search results
  useEffect(() => {
    if (sortedLands.length > 0)
      mapViewRef.current?.focusOnPopupMarker(sortedLands[0].title!);
  }, [mapUpdateIteration, sortOption]);

  // Show popup marker when a land is added to favourites
  useEffect(() => {
    registerFavouriteToggleCallback(
      (landSlug: string, isFavourite: boolean) => {
        if (isFavourite) {
          const title =
            lands.find((land) => land.slug === landSlug)?.title || "Dat nen";

          mapViewRef.current?.focusOnPopupMarker(title, false);
        }
      },
    );
  }, [mapUpdateIteration]);

  return (
    <div className=" relative  z-10  min-w-[20rem]   pl-4 pr-2 pt-4  @container/search-results md:flex-1 md:max-lg:self-start lg:overflow-hidden ">
      <div className=" mb-3 grid cursor-default grid-cols-2 items-center gap-0.5 text-base font-normal lg:pl-1.5">
        <div className="hidden lg:inline-block">
          Hiện có{" "}
          <strong className="font-semibold">{lands.length} lô đất</strong> bán
        </div>

        <ViewSwitch
          isChecked={isMapShown}
          onToggle={handleViewSwitchToggle}
          className="lg:hidden"
        />

        <div className=" flex select-none items-center place-self-end text-sm">
          <button
            onClick={onOpenFilters}
            className="button-click-animation z-40 inline-flex h-fit w-fit cursor-pointer items-center justify-center gap-x-1.5 place-self-end rounded-lg  border-2 border-solid  px-2 py-1 text-sm font-medium text-[--color-secondary] transition duration-300 ease-in-out hover:border-[--color-secondary] hover:bg-[--color-secondary-transparent-lighter] hover:text-[--color-secondary-darker] md:hidden"
          >
            <span className="text-[--color-text]">Bộ lọc</span>
            <FilterIcon />
          </button>

          <span className="hidden @3xl/search-results:inline-block">
            Sắp xếp theo:
          </span>
          <Dropdown
            options={SORT_OPTIONS}
            selectedOption={sortOption}
            onUpdateSelection={handleSortOptionChange}
            className="pl-0.5"
          >
            <SortIcon />
          </Dropdown>
        </div>
      </div>

      <div
        className={` mb-4 grid gap-4 @[44.5rem]/search-results:grid-cols-[2fr,1fr]  @[44.5rem]/search-results:items-stretch  @[60rem]/search-results:grid-cols-2 lg:h-full lg:overflow-y-scroll lg:pb-48 lg:pl-2 lg:pr-2 @[44.5rem]/search-results:[&>*:nth-child(3n+2)]:row-span-2 @[60rem]/search-results:[&>*:nth-child(3n+2)]:row-span-1 ${
          isMapShown ? "max-lg:hidden" : ""
        }`}
        id="scrollable-lands-container"
        data-lenis-prevent
      >
        {sortedLands.map((land) => (
          <Card key={land.slug} land={land} />
        ))}

        {/* In a 1row-1row-2row grid layout fill the empty space in the end when number of cards is not divisible by 3 */}
        {sortedLands.length > 0 && ~~(sortedLands.length / 3) === 2 && (
          <Card
            key={"last-card"}
            land={sortedLands[0]}
            className="hidden @[44.5rem]/search-results:block @[60rem]/search-results:hidden"
          />
        )}

        {sortedLands.length === 0 && (
          <EmptySearch onResetSearch={onResetSearch} className="col-span-2" />
        )}
      </div>
      <div
        className="  absolute right-0 top-0 z-10 mt-14 hidden h-full  w-1.5 cursor-col-resize opacity-50 lg:block "
        id="resize-handle"
      ></div>
    </div>
  );
};

export default SearchResults;
