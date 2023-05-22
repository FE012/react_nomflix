import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  console.log(location);
  return null;
}

export default Search;
