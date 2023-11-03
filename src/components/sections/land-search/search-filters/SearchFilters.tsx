import { useEffect, useState } from "react";

import RangeInput from "./RangeInput";
import SelectionInput from "./SelectionInput";

import "../../../ui/buttons/ButtonClickAnimation.sass";
import FilterIcon from "./FilterIcon";

export interface FilterFunc {
  (
    priceRange: number[],
    sizeRange: number[],
    filterOptions: LandTypeOption[],
  ): void;
}

interface Props {
  maxPrice: number;
  initialPriceRange?: number[];
  maxSize: number;
  initialSizeRange?: number[];
  initialFilterByType?: LandTypeOption[];
  onSubmit: FilterFunc;
  resetIteration: number;
}

const landTypesOptions = ["Khuyến khích", "Yêu thích"] as const;
export type LandTypeOption = (typeof landTypesOptions)[number];

const SearchFilters: React.FC<Props> = ({
  maxPrice,
  initialPriceRange,
  maxSize,
  initialSizeRange,
  initialFilterByType,
  onSubmit,
  resetIteration,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>(
    initialPriceRange || [0, maxPrice],
  );
  const [selectedSizeRange, setSelectedSizeRange] = useState<number[]>(
    initialSizeRange || [0, maxSize],
  );
  const [filterByType, setFilterByType] = useState<LandTypeOption[]>(
    initialFilterByType || [],
  );

  const handleFiltersSubmit = () => {
    onSubmit(selectedPriceRange, selectedSizeRange, filterByType);

    setIsOpen(false); // Close the filters dropdown on small screens
  };

  const handleFiltersReset = () => {
    onSubmit([0, maxPrice], [0, maxSize], []);

    // Timeout is needed to fix a bug when the slider jumps to the right after reset
    setTimeout(() => {
      setSelectedPriceRange([0, maxPrice]);
      setSelectedSizeRange([0, maxSize]);
      setFilterByType([]);

      // setTimeout(() => {
      //   setIsOpen(false); // Close the filters dropdown on small screens
      // }, 1);
    }, 100);
  };

  // Reset filters -> this is basically a hack to reset filters from child components, should be refactored (store filters state higher in the tree)!!!
  useEffect(() => {
    if (resetIteration > 0) {
      handleFiltersReset();
    }
  }, [resetIteration]);

  const hiddenClass =
    "max-md:opacity-0  max-md:invisible max-md:scale-95 ease-in [transition:visibility_0s_0.2s,all_0.1s]";
  const visibleClass =
    "max-md:opacity-100  max-md:visible max-md:scale-100 transition duration-100 ease-out";

  return (
    <>
      {/* <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="button-click-animation z-50 inline-flex h-fit w-fit cursor-pointer items-center justify-center gap-x-1.5 rounded-lg border-2 border-solid  px-2 py-1  text-sm font-medium text-[--color-secondary] transition duration-300 ease-in-out hover:border-[--color-secondary] hover:bg-[--color-secondary-transparent-lighter] hover:text-[--color-secondary-darker] md:hidden"
      >
        <span className="text-[--color-text]">Bộ lọc</span>
        <FilterIcon />
      </button> */}

      <div
        className={`w-50 h-full max-md:fixed max-md:z-50 max-md:w-full max-md:px-4   ${
          isOpen ? visibleClass : hiddenClass
        }`}
        onClick={(e) => {
          if (!(e.target instanceof HTMLElement)) return;
          if (e.target.closest("#search-filters")) return;

          setIsOpen(false);
        }}
      >
        <div
          className="z-50 w-full cursor-default max-md:mx-auto max-md:max-w-lg max-md:rounded-lg  max-md:bg-white max-md:px-8  max-md:py-6 max-md:shadow-lg max-md:ring-1 max-md:ring-black max-md:ring-opacity-5 max-md:focus:outline-none md:sticky md:top-2 md:block md:translate-x-0 md:pl-10 md:pr-6 md:pt-6 lg:static"
          id="search-filters"
        >
          <span className="mb-4 block text-base font-semibold opacity-50">
            Bộ lọc:
          </span>

          <div className="mb-6">
            <span className="mb-4 block text-base font-semibold">Kiểu đất</span>

            <legend className="sr-only">Type of land radio buttons</legend>

            <SelectionInput
              options={landTypesOptions}
              selectedOptions={filterByType}
              onUpdateSelection={(toggledOption) => {
                setFilterByType((prev) => {
                  if (prev.includes(toggledOption)) {
                    return prev.filter((option) => option !== toggledOption);
                  } else {
                    return [...prev, toggledOption];
                  }
                });
              }}
            />
          </div>

          <div className="mb-6">
            <span className="mb-4 block text-base font-semibold">
              Giá, tỷ dong
            </span>

            <RangeInput
              id={"priceRange"}
              values={selectedPriceRange}
              onUpdateValues={(values) => setSelectedPriceRange(values)}
              options={{
                max: maxPrice,
                min: 0,
                step: 0.1,
              }}
            />
          </div>
          <div className="mb-6">
            <span className="mb-4 block text-base font-semibold">
              Diện tích, m<sup>2</sup>
            </span>

            <RangeInput
              id={"sizeRange"}
              values={selectedSizeRange}
              onUpdateValues={(values) => setSelectedSizeRange(values)}
              options={{
                max: maxSize,
                min: 0,
                step: 100,
              }}
            />
          </div>

          <button
            type="submit"
            onClick={handleFiltersSubmit}
            className="button-click-animation block w-full cursor-pointer rounded-lg border-2 border-solid border-[--color-secondary] bg-[--color-secondary] px-8 py-2 text-center text-sm font-medium tracking-wide text-white transition   duration-300 ease-in-out hover:opacity-90"
          >
            Apply
          </button>
          <div className="mt-1 flex justify-center">
            <button
              className="button-click-animation block cursor-pointer rounded-lg px-3 py-1.5 text-center text-sm font-medium text-[--color-secondary] transition duration-300 ease-in-out hover:text-[--color-secondary-darker]"
              onClick={handleFiltersReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
