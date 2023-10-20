import type { Land } from "../../../model/Land";
import Card from "./Card";

interface Props {
  lands: Land[];
}

const SearchResults: React.FC<Props> = ({ lands }) => {
  return (
    <div className="">
      {lands.map((land) => (
        <Card key={land.slug} land={land} />
      ))}
    </div>
  );
  return lands.map((land) => <Card key={land.slug} land={land} />);
};

export default SearchResults;
