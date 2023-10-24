import type { Land } from "../../../../model/Land";
import ImagesPreview from "./ImagesPreview";
import LandDescription from "./LandDescription";

interface Props {
  land: Land;
}

const Card: React.FC<Props> = ({ land }) => {
  return (
    <div className="bg-white border  rounded-lg grid grid-cols-2  gap-2 place-items-stretch place-content-stretch mb-2 overflow-hidden">
      <div className=" w-full h-full">
        <ImagesPreview images={land.images || []} />
      </div>

      <LandDescription land={land} />
    </div>
  );
};

export default Card;
