import { useState } from "react";

import SearchResults from "./SearchResults";
import type { Land } from "../../../model/Land";
import SearchFilter from "./SearchFilters";

interface Props {
  preloadedLands: Land[];
  children?: React.ReactNode;
}

const LandSearch: React.FC<Props> = ({ preloadedLands, children }) => {
  console.log("Preloaded lands:", preloadedLands.length);

  // Read the query params from the URL (e.g. ?price=1000), but only on the client side (i.e. not during SSR)
  let queryParams = "";
  if (typeof window !== "undefined") queryParams = window.location.search;

  const searhParams = new URLSearchParams(queryParams);

  console.log("Query params:", queryParams);

  // if (typeof window !== "undefined") {
  //   const newURL = `${window.location.pathname}?parameterName=newValue${window.location.hash}`;
  //   window.history.pushState({}, "", newURL);

  //   // window.addEventListener('popstate', () => {
  //   //   // Handle URL changes here
  //   // });
  // }

  const filteredLands = preloadedLands.filter(
    (land) => land.price && land.price > 0
  );

  return (
    <>
      <div className="w-56">
        <SearchFilter />
      </div>
      <div
        className="flex-1 overflow-y-scroll "
        id="scrollable-test"
        data-lenis-prevent
      >
        <SearchResults lands={filteredLands} />
      </div>
      {children}
    </>
  );
};

export default LandSearch;
