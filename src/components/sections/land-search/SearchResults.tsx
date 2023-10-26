import { useState } from "react";

import type { Land } from "../../../model/Land";
import Card from "./card/Card";
import Dropdown from "./Dropdown";

interface Props {
  lands: Land[];
}

const SORT_OPTIONS = [
  "Mới thêm trước",
  "Rẻ nhất trước",
  "Đắt nhất trước",
  "Nhỏ nhất trước",
  "Lớn nhất trước",
];

const sortLands = (lands: Land[], option: number) => {
  if (option <= 0) return lands;

  if (option === 1) return lands.toSorted((a, b) => a.price! - b.price!);

  if (option === 2) return lands.toSorted((a, b) => b.price! - a.price!);

  if (option === 3) return lands.toSorted((a, b) => a.area! - b.area!);

  if (option === 4) return lands.toSorted((a, b) => b.area! - a.area!);

  return lands;
};

const SearchResults: React.FC<Props> = ({ lands }) => {
  const [sortOption, setSortOption] = useState(0);

  const sortedLands = sortLands(lands, sortOption);

  if (lands.length === 0)
    return <div>TODO: text and btn link to reset filter</div>;

  return (
    <>
      <div className=" flex items-center justify-between mb-3  text-base font-normal">
        <div>
          <strong className="font-semibold">{lands.length} lo đất</strong> dang
          bán dat dieu kien...
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
      </div>
    </>
  );
};

export default SearchResults;
