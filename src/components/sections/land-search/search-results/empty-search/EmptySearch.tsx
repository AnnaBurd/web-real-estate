import EmptySearchIcon from "./EmptySearchIcon";

interface Props {
  onResetSearch: () => void;
}

const EmptySearch: React.FC<Props> = ({ onResetSearch }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center select-none text-center gap-3.5 pb-20">
      <EmptySearchIcon />

      <span>
        Không tìm thấy kết quả phù hợp. <br />
        Bạn có muốn{" "}
        <button
          onClick={onResetSearch}
          className="hover:underline button-click-animation"
        >
          đặt lại bộ lọc?
        </button>
      </span>
    </div>
  );
};

export default EmptySearch;
