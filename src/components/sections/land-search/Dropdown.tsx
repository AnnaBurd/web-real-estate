import { useState, useRef, useEffect } from "react";

interface Props {
  options: string[];
  selectedOption: number;
  onUpdateSelection: (option: number) => void;
}

const Dropdown: React.FC<Props> = ({
  options,
  selectedOption,
  onUpdateSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      isOpen &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div className="relative inline-block ">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex w-full justify-center items-center gap-x-1.5 button-click-animation border-2 border-solid px-2 py-1 rounded-lg text-sm  font-medium cursor-pointer  hover:border-[--color-secondary] hover:bg-[--color-secondary-transparent-lighter] hover:text-[--color-secondary-darker] transition duration-300 ease-in-out z-10"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {selectedOption === -1 ? "Mặc định" : options[selectedOption]}
          <svg
            className="-mr-1 h-5 w-5 "
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        ref={dropdownRef}
        className={`absolute right-0 z-10 mt-1.5 w-36 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          {options.map((option, index) => (
            <a
              onClick={() => {
                setIsOpen(false);
                onUpdateSelection(index);
              }}
              key={option}
              href="#"
              className={` block px-4 py-2 text-sm  hover:bg-[--color-secondary-transparent-lighter] hover:text-[--color-secondary-darker] transition duration-300 ease-in-out ${
                index === selectedOption
                  ? "bg-[--color-secondary-transparent-lighter] text-[--color-secondary-darker]"
                  : ""
              }`}
              role="menuitem"
              tabIndex={-1}
              id={`menu-item-${index}`}
            >
              {option}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;