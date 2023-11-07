import type { MapView } from "../../../../map/MapView";

interface Props {
  id: string;
  className?: string;
}

const ShowOnMapBtn: React.FC<Props> = ({ id, className }) => {
  const onClick = () => {
    const map: MapView = document.querySelector("map-view")!;

    map.focusOnPopupMarker(id);
  };

  return (
    <button
      onClick={onClick}
      className={`button-click-animation relative mt-1  flex  h-10 w-10 items-center justify-center rounded-lg bg-[#607cb320] ${
        className ? className : ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="bouncy-animation not-liked z-10 h-6 w-6 text-white"
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
