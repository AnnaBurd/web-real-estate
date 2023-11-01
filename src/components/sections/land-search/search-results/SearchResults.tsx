import { useEffect, useRef, useState } from "react";

import type { Land } from "../../../../model/Land";
import Card from "./card/Card";
import Dropdown from "../../../ui/Dropdown";
import type { MapView } from "../../../map/MapView";

import "./SearchResults.sass";

interface Props {
  lands: Land[];
  mapUpdateIteration: number;
  onResetSearch: () => void;
}

const SORT_OPTIONS = [
  "Mới thêm trước",
  "Rẻ nhất trước",
  "Đắt nhất trước",
  "Nhỏ nhất trước",
  "Lớn nhất trước",
];

const sortLands = (lands: Land[], sortOption: number) => {
  if (sortOption <= 0) return lands;

  if (sortOption === 1) return lands.toSorted((a, b) => a.price! - b.price!);

  if (sortOption === 2) return lands.toSorted((a, b) => b.price! - a.price!);

  if (sortOption === 3) return lands.toSorted((a, b) => a.area! - b.area!);

  if (sortOption === 4) return lands.toSorted((a, b) => b.area! - a.area!);

  return lands;
};

const SearchResults: React.FC<Props> = ({
  lands,
  mapUpdateIteration,
  onResetSearch,
}) => {
  const [sortOption, setSortOption] = useState(0); // By default show newly added lands first

  const sortedLands = sortLands(lands, sortOption);

  // Reference to map-view element (used to show search results on map)
  const mapViewRef = useRef<MapView | null>(null);

  const rerenderMapMarkers = (lands: Land[]) => {
    mapViewRef.current?.renderPopupMarkers(lands.filter((land) => land.coords));

    if (lands.length > 0)
      mapViewRef.current?.showPopupOnMarker(lands[0].title!);
  };

  // Get reference to map-view element (used to show location markers)
  useEffect(() => {
    mapViewRef.current = document.querySelector("map-view") as MapView;
  }, []);

  // Update map each time sort order or sort results change
  useEffect(() => {
    rerenderMapMarkers(sortedLands);
  }, [mapUpdateIteration, sortOption]);

  return (
    <>
      <div className=" flex items-center justify-between mb-3  text-base font-normal cursor-default">
        <div>
          Hiện có{" "}
          <strong className="font-semibold">{lands.length} lô đất</strong> bán
        </div>
        <div className=" select-none text-sm">
          Sắp xếp theo:{" "}
          <Dropdown
            options={SORT_OPTIONS}
            selectedOption={sortOption}
            onUpdateSelection={(option) => setSortOption(option)}
          />
        </div>
      </div>
      <div
        className="h-full overflow-y-scroll  pr-3 pb-10"
        id="scrollable-lands-container"
        data-lenis-prevent
      >
        {sortedLands.map((land) => (
          <Card key={land.slug} land={land} />
        ))}

        {sortedLands.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center select-none">
            <span>
              What a pity! Không tìm thấy kết quả nào phù hợp, ban co muon{" "}
              <button onClick={onResetSearch}>try again?</button>
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;
