import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { getSearchMovie, getSearchTv } from "./searchApi";
import { makeImagePath } from "./util";

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 150px;
  font-size: 22px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Info = styled(motion.div)`
  h4 {
    font-weight: 400;
  }
`;

function SearchResult({ keyword }: { keyword: string }) {
  const { data: searchMovie } = useQuery(["search", keyword], () =>
    getSearchMovie(keyword)
  );
  const { data: searchTv } = useQuery(["search", keyword], () =>
    getSearchTv(keyword)
  );
  console.log(searchMovie);

  const history = useHistory();
  const onBoxClicked = (id: number) => {};
  return (
    <>
      {searchMovie ? (
        <Row>
          {searchMovie?.results.map((movie: any) => (
            <Box
              layoutId={movie.id + ""}
              key={movie.id}
              // variants={boxVariants}
              initial="normal"
              whileHover="hover"
              transition={{ type: "tween" }}
              onClick={() => onBoxClicked(movie.id)}
              bgphoto={makeImagePath(movie.backdrop_path, "w500")}
            >
              <Info>
                <h4>{movie.title}</h4>
              </Info>
            </Box>
          ))}
        </Row>
      ) : null}
    </>
  );
}

export default SearchResult;
