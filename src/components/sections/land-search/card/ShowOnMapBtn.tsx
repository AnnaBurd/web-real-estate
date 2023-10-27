interface Props {
  id: string;
  className?: string;
}

const ShowOnMapBtn: React.FC<Props> = ({ id, className }) => {
  const onClick = () => {
    const map: any = document.querySelector("map-view");

    map.focusOnMarker(id);
  };

  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 rounded-lg bg-[#607cb320] flex justify-center items-center button-click-animation mt-1 ${
        className ? className : ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 bouncy-animation not-liked z-10 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    </button>
  );
};

export default ShowOnMapBtn;
