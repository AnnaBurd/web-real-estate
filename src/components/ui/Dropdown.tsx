import { useState, useRef, useEffect } from "react";

interface Props {
  options: string[];
  selectedOption: number;
  onUpdateSelection: (option: number) => void;
  children?: React.ReactNode;
}

const Dropdown: React.FC<Props> = ({
  options,
  selectedOption,
  onUpdateSelection,
  children,
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
    <div className="relative z-50 inline-block">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className=" button-click-animation z-10 inline-flex w-full cursor-pointer items-center justify-center gap-x-1.5 rounded-lg border-2 border-solid  px-2 py-1  text-sm font-medium transition duration-300 ease-in-out hover:border-[--color-secondary] hover:bg-[--color-secondary-transparent-lighter] hover:text-[--color-secondary-darker]"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <span className="text-[--color-secondary] @lg/search-results:hidden">
            {children}
          </span>
          <span className="hidden @lg/search-results:block">
            {selectedOption === -1 ? "Mặc định" : options[selectedOption]}
          </span>
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
        className={`absolute right-0 mt-1.5 w-36 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
          isOpen
            ? "visible scale-100 opacity-100 transition duration-100 ease-out"
            : "invisible scale-95 opacity-0 ease-in [transition:visibility_0s_0.2s,all_0.075s]"
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
              className={` block px-4 py-2 text-sm  transition duration-300 ease-in-out hover:bg-[--color-secondary-transparent-lighter] hover:text-[--color-secondary-darker] ${
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
