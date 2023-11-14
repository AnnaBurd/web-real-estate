import { type FC } from "react";

type Props = {
  isChecked: boolean;
  onToggle: () => void;
  className?: string;
};

const ViewSwitch: FC<Props> = ({ isChecked, onToggle, className }) => {
  const handleCheckboxChange = onToggle;

  return (
    <div
      className={`flex items-center gap-1 text-sm ${
        className ? className : ""
      }`}
    >
      <span>Danh sách</span>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="peer sr-only"
          />
          <div className="block h-6 w-10 rounded-full bg-[#e5e7eb]  transition-colors duration-300 peer-checked:bg-[#e5e7eb]"></div>
          <div className="dot absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[--color-secondary] transition duration-300 peer-checked:translate-x-[1rem] peer-checked:bg-[--color-accent]">
            <span className={`h-3.5 w-3.5 rounded-full bg-white`}></span>
          </div>
        </div>
      </label>
      <span>Bản đồ</span>
    </div>
  );
};

export default ViewSwitch;
