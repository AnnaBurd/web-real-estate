import type { Land } from "../../../../model/Land";
import ImagesPreview from "./ImagesPreview";
import LandDescription from "./LandDescription";

interface Props {
  land: Land;
}

const Card: React.FC<Props> = ({ land }) => {
  return (
    <div className="bg-white shadow-sm hover:shadow-md  rounded-lg grid grid-cols-2  gap-2 place-items-stretch place-content-stretch mb-4 transition duration-300 overflow-hidden">
      <div className=" w-full h-full">
        <ImagesPreview images={land.images || []} />
      </div>

      <LandDescription land={land} />

      <button
        onClick={() => {
          const map: any = document.querySelector("map-view");

          map.focusOnMarker(land.title);
        }}
      >
        focuse on map
      </button>
    </div>
  );
};

export default Card;
