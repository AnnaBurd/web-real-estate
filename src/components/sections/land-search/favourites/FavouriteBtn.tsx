import { useContext } from "react";
import { FavouritesContext } from "./FavouritesContext";

import "./FavouriteBtn.sass";

interface Props {
  id: string;
}

const FavouriteBtn: React.FC<Props> = ({ id }) => {
  const { handleToggleFavourite, isFavourite } = useContext(FavouritesContext);

  const onClick = () => {
    handleToggleFavourite(id);
  };
  const isActive = isFavourite(id);

  return (
    <button
      onClick={onClick}
      className="like-button button-click-animation relative z-20 flex h-10 w-10 items-center justify-center rounded-lg bg-[#607cb320]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`bouncy-animation is-liked z-10 h-6 w-6 text-white ${
          isActive ? "block" : "hidden"
        }`}
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`bouncy-animation not-liked z-10 h-6 w-6 text-white ${
          isActive ? "hidden" : "block"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>

      <span
        className={`like-overlay absolute inset-0 z-0 block rounded-lg bg-[--color-like] transition-all duration-[400ms] ${
          isActive ? "scale-1" : "scale-0"
        }`}
      ></span>
    </button>
  );
};

export default FavouriteBtn;
