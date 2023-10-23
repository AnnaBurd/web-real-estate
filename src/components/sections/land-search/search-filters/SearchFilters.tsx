import { useState } from "react";

import RangeInput from "./RangeInput";
import SelectionInput from "./SelectionInput";

import "../../../ui/buttons/ButtonClickAnimation.sass";

interface Props {
  // Define props here
}

const landTypesOptions = ["Khuyến khích", "Yêu thích"] as const;
export type LandTypeOption = (typeof landTypesOptions)[number];

const SearchFilters: React.FC<Props> = (props) => {
  const [sizeRange, setSizeRange] = useState<number[]>([0, 1000]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 25]);
  const [filterByType, setFilterByType] = useState<LandTypeOption[]>([]);

  const handleReset = () => {
    setSizeRange([0, 1000]);
    setPriceRange([0, 25]);
    setFilterByType([]);
  };

  return (
    <div className="border w-full h-full  pl-10 pr-6">
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
            console.log("new", toggledOption);

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
          values={priceRange}
          onUpdateValues={(values) => setPriceRange(values)}
          options={{
            max: 25,
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
          values={sizeRange}
          onUpdateValues={(values) => setSizeRange(values)}
          options={{
            max: 1000,
            min: 0,
            step: 100,
          }}
        />
      </div>

      <button
        type="submit"
        className="button-click-animation border-2 border-solid w-full block px-8 py-2 rounded-lg text-sm text-center font-medium cursor-pointer bg-[--color-secondary] text-white tracking-wide border-[--color-secondary] hover:opacity-90   transition duration-300 ease-in-out"
      >
        Apply
      </button>
      <div className="flex justify-center mt-1">
        <button
          className="button-click-animation block px-3 py-1.5 text-sm text-center font-medium cursor-pointer text-[--color-secondary] hover:text-[--color-secondary-darker] transition duration-300 ease-in-out"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
