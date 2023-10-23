import type { LandTypeOption } from "./SearchFilters";
import SelectionInputOption from "./SelectionInputOption";

interface Props {
  options: readonly LandTypeOption[];
  selectedOptions: LandTypeOption[];
  onUpdateSelection: (toggledOption: LandTypeOption) => void;
}

const SelectionInput: React.FC<Props> = ({
  options,
  selectedOptions,
  onUpdateSelection,
}) => {
  return (
    <div className="w-full flex flex-col gap-2.5">
      {options.map((option) => (
        <SelectionInputOption
          key={option}
          value={option}
          isSelected={selectedOptions.includes(option)}
          onToggle={onUpdateSelection}
        />
      ))}
    </div>
  );
};

export default SelectionInput;
