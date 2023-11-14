import type { LandTypeOption } from "./SearchFilters";

interface Props {
  value: LandTypeOption;
  isSelected: boolean;
  onToggle: (toggledOption: LandTypeOption) => void;
}

const SelectionInputOption: React.FC<Props> = ({
  value,
  isSelected,
  onToggle,
}) => {
  return (
    <div className="w-full">
      <input
        type="checkbox"
        id={value}
        checked={isSelected}
        className="hidden"
        onChange={() => {
          onToggle(value);
        }}
      />

      <label
        htmlFor={value}
        className={`button-click-animation border-2 border-solid w-full block px-8 py-2 rounded-lg text-sm text-center font-medium cursor-pointer  hover:border-[--color-secondary] hover:bg-[--color-secondary-transparent-lighter] hover:text-[--color-secondary-darker] transition duration-300 ease-in-out ${
          isSelected
            ? "border-[--color-secondary] bg-[--color-secondary-transparent-lighter] text-[--color-secondary-darker]"
            : "border-[--color-grey-medium]"
        }`}
      >
        {value}
      </label>
    </div>
  );
};

export default SelectionInputOption;
