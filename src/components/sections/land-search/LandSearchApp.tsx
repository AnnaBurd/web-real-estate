import { useEffect, useRef, type FC } from "react";
import type { Land } from "../../../model/Land";
import { FavouritesContextProvider } from "./favourites/FavouritesContext";
import LandSearch from "./LandSearch";
import listenForHorizontalResize from "./search-results/horizontalResizeListener";
import { fadeIn } from "../../loader/loading-page-transitions/transitions";

interface Props {
  preloadedLands: Land[];
  maxPrice: number;
  maxSize: number;
}

const onLandSearchAppMount = () => {
  listenForHorizontalResize();

  fadeIn();
};

const LandSearchApp: FC<Props> = ({ preloadedLands, maxPrice, maxSize }) => {
  useEffect(() => {
    onLandSearchAppMount();
  }, []);

  return (
    <FavouritesContextProvider>
      <LandSearch
        preloadedLands={preloadedLands}
        maxPrice={maxPrice}
        maxSize={maxSize}
      />
    </FavouritesContextProvider>
  );
};

export default LandSearchApp;
