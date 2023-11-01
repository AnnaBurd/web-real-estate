import { createContext, useState, type ReactNode, useEffect } from "react";

type FavouritesContextType = {
  favourites: string[];
  handleToggleFavourite: (id: string) => void;
  registerToggleCallback: (cb: () => void) => void;
  isFavourite: (id: string) => boolean;
};

let callbackOnFavouriteToggle = () => {}; // Callback to be called when favourites change, to trigger conditional re-rendering

export const FavouritesContext = createContext<FavouritesContextType>({
  favourites: [],
  handleToggleFavourite: () => {},
  registerToggleCallback: (cb: () => void) => {},
  isFavourite: () => false,
});

export const FavouritesContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favourites, setFavourites] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("favourites") || "[]")
  );

  const isFavourite = (id: string) => favourites.includes(id);

  const handleToggleFavourite = (id: string) => {
    if (isFavourite(id)) {
      setFavourites((prev) => prev.filter((item: string) => item !== id));
    } else {
      setFavourites((prev) => [...prev, id]);
    }

    // Call toggle callback
    callbackOnFavouriteToggle();
  };

  const registerToggleCallback = (cb: () => void) => {
    callbackOnFavouriteToggle = cb;
  };

  // Update local storage when favourites change (* do not update directly in handleToggleFavourite for performance reasons, TODO: test performance and compare *)
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        handleToggleFavourite,
        isFavourite,
        registerToggleCallback,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};
