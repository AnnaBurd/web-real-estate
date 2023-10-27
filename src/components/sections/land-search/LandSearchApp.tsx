import type { FC } from "react";
import type { Land } from "../../../model/Land";
import { FavouritesContextProvider } from "./favourites/FavouritesContext";
import LandSearch from "./LandSearch";

interface Props {
  preloadedLands: Land[];
  maxPrice: number;
  maxSize: number;
}

const LandSearchApp: FC<Props> = ({ preloadedLands, maxPrice, maxSize }) => {
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
