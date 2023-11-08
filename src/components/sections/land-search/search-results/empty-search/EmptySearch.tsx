import EmptySearchIcon from "./EmptySearchIcon";

interface Props {
  onResetSearch: () => void;
  className?: string;
}

const EmptySearch: React.FC<Props> = ({ onResetSearch, className }) => {
  return (
    <div
      className={`flex h-full select-none flex-col items-center justify-center gap-3.5 pb-20 text-center ${
        className ? className : ""
      }`}
    >
      <EmptySearchIcon />

      <span>
        Không tìm thấy kết quả phù hợp. <br />
        Bạn có muốn{" "}
        <button
          onClick={onResetSearch}
          className="button-click-animation hover:underline"
        >
          đặt lại bộ lọc?
        </button>
      </span>
    </div>
  );
};

export default EmptySearch;
