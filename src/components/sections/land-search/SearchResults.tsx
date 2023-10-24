import type { Land } from "../../../model/Land";
import Card from "./card/Card";

interface Props {
  lands: Land[];
}

const SearchResults: React.FC<Props> = ({ lands }) => {
  if (lands.length === 0)
    return <div>todo: text and btn link to reset filter</div>;

  return (
    <div>
      {lands.map((land) => (
        <Card key={land.slug} land={land} />
      ))}
    </div>
  );
};

export default SearchResults;
