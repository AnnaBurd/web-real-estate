import type { Land } from "../../../../model/Land";
import FavouriteBtn from "../favourites/FavouriteBtn";
import ImagesPreview from "./ImagesPreview";
import LandDescription from "./LandDescription";
import ShowOnMapBtn from "./ShowOnMapBtn";

interface Props {
  land: Land;
}

const Card: React.FC<Props> = ({ land }) => {
  return (
    <div className="bg-white shadow-sm hover:shadow-md  rounded-lg grid grid-cols-2  gap-2 place-items-stretch place-content-stretch mb-4 transition duration-300 overflow-hidden relative">
      <div className=" w-full h-full">
        <ImagesPreview images={land.images || []} />
      </div>

      <LandDescription land={land} />

      <div className="absolute top-2 right-2 group">
        <FavouriteBtn id={land.slug} />

        <ShowOnMapBtn
          id={land.title!}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </div>
  );
};

export default Card;
