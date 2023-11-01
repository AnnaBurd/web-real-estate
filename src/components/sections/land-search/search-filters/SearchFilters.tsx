import { useEffect, useState } from "react";

import RangeInput from "./RangeInput";
import SelectionInput from "./SelectionInput";

import "../../../ui/buttons/ButtonClickAnimation.sass";

export interface FilterFunc {
  (
    priceRange: number[],
    sizeRange: number[],
    filterOptions: LandTypeOption[]
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
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>(
    initialPriceRange || [0, maxPrice]
  );
  const [selectedSizeRange, setSelectedSizeRange] = useState<number[]>(
    initialSizeRange || [0, maxSize]
  );
  const [filterByType, setFilterByType] = useState<LandTypeOption[]>(
    initialFilterByType || []
  );

  const handleFiltersSubmit = () => {
    onSubmit(selectedPriceRange, selectedSizeRange, filterByType);
  };

  const handleFiltersReset = () => {
    setSelectedPriceRange([0, maxPrice]);
    setSelectedSizeRange([0, maxSize]);
    setFilterByType([]);
    onSubmit([0, maxPrice], [0, maxSize], []);
  };

  // Reset filters -> this is basically a hack to reset filters from child components, should be refactored (store filters state higher in the tree)!!!
  useEffect(() => {
    if (resetIteration > 0) {
      handleFiltersReset();
    }
  }, [resetIteration]);

  return (
    <div className="w-full h-full  pl-10 pr-6 pt-6 cursor-default">
      <span className="font-semibold mb-4 block text-base opacity-50">
        Bộ lọc:
      </span>

      <div className="mb-6">
        <span className="font-semibold mb-4 block text-base">Kiểu đất</span>

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
        <span className="font-semibold mb-4 block text-base">Giá, tỷ dong</span>

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
        <span className="font-semibold mb-4 block text-base">
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
        className="button-click-animation border-2 border-solid w-full block px-8 py-2 rounded-lg text-sm text-center font-medium cursor-pointer bg-[--color-secondary] text-white tracking-wide border-[--color-secondary] hover:opacity-90   transition duration-300 ease-in-out"
      >
        Apply
      </button>
      <div className="flex justify-center mt-1">
        <button
          className="button-click-animation block px-3 py-1.5 text-sm text-center font-medium cursor-pointer text-[--color-secondary] hover:text-[--color-secondary-darker] transition duration-300 ease-in-out"
          onClick={handleFiltersReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
