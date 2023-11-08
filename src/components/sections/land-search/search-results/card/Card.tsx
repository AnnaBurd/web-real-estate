import type { Land } from "../../../../../model/Land";
import FavouriteBtn from "../../favourites/FavouriteBtn";
import ImagesPreview from "./ImagesPreview";
import LandDescription from "./LandDescription";
import ShowOnMapBtn from "./ShowOnMapBtn";

interface Props {
  land: Land;
  className?: string;
}

const Card: React.FC<Props> = ({ land, className }) => {
  return (
    <div
      className={`land-card @container/land-card ${className ? className : ""}`}
    >
      <div className="relative mb-4 grid h-full max-h-[40rem]  min-h-fit w-full grid-cols-1  place-content-stretch place-items-stretch gap-2  overflow-hidden rounded-lg bg-white shadow-sm transition duration-300 hover:shadow-md @md/land-card:max-h-[22rem] @md/land-card:grid-cols-2">
        <ImagesPreview images={land.images || []} url={land.slug} />

        <LandDescription land={land} />

        <div className="group absolute right-2 top-2 z-30">
          <FavouriteBtn id={land.slug} />

          <ShowOnMapBtn
            id={land.title!}
            className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-lg:hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
