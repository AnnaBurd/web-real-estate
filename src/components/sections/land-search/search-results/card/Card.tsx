import type { Land } from "../../../../../model/Land";
import FavouriteBtn from "../../favourites/FavouriteBtn";
import ImagesPreview from "./ImagesPreview";
import LandDescription from "./LandDescription";
import ShowOnMapBtn from "./ShowOnMapBtn";

interface Props {
  land: Land;
}

const Card: React.FC<Props> = ({ land }) => {
  return (
    <div className="@container/land-card">
      <div className="relative mb-4 grid  grid-cols-1 place-content-stretch place-items-stretch  gap-2 overflow-hidden rounded-lg bg-white shadow-sm transition duration-300 hover:shadow-md @sm/land-card:bg-red-500 @7xl/land-card:grid-cols-2">
        <ImagesPreview images={land.images || []} url={land.slug} />

        <LandDescription land={land} />

        <div className="group absolute right-2 top-2">
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
