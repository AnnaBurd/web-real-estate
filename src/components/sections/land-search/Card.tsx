import type { Land } from "../../../model/Land";

interface Props {
  land: Land;
}

const Card: React.FC<Props> = ({ land }) => {
  return <div className="bg-rose-300 m-6 h-48">{land.title}</div>;
};

export default Card;
