import { createContext, useState, type ReactNode, useEffect } from "react";

type FavouritesContextType = {
  favourites: string[];
  handleToggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
};

export const FavouritesContext = createContext<FavouritesContextType>({
  favourites: [],
  handleToggleFavourite: () => {},
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
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};
