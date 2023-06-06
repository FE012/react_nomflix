import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getSearch } from "./api";
import { makeImagePath, noSearchDataImage } from "./util";

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 90%;
`;

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

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
  }
`;

const NoSearchData = styled.div<{ imgUrl: string }>`
  position: absolute;
  top: 40%;
  padding-top: 100px;
  width: 90%;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  background: url(${(props) => props.imgUrl}) no-repeat center top;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.5,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

//모달창 스타일 컴포넌트
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 99;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 350px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 36px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigAverage = styled.h4`
  font-size: 22px;
  margin: 10px;
`;

function SearchResult({ keyword }: { keyword: string }) {
  const { data: search } = useQuery(["search", keyword], () =>
    getSearch(keyword)
  );
  console.log(search);
  const { scrollY } = useScroll();
  const bigMatch = useRouteMatch<{ id: string }>("/search/:media/:id");
  console.log(bigMatch);
  const history = useHistory();
  const onBoxClicked = (media: string, id: number) => {
    history.push(`/search/${media}/${id}?keyword=${keyword}`);
  };
  const onOverlayClick = () => history.goBack();

  const clickedBox =
    bigMatch?.params.id &&
    search?.results.find((media: any) => media.id + "" === bigMatch.params.id);
  console.log(clickedBox);
  return (
    <>
      {search && search.results.length > 0 ? (
        <>
          <Row>
            {search?.results.map((movie: any) => (
              <Box
                layoutId={movie.id + ""}
                key={movie.id}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                onClick={() => onBoxClicked(movie.media_type, movie.id)}
                bgphoto={makeImagePath(movie.backdrop_path || "", "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title ? movie.title : movie.name}</h4>
                </Info>
              </Box>
            ))}
          </Row>
          <AnimatePresence>
            {bigMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigMatch.params.id}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedBox && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedBox.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>
                        {clickedBox.media_type === "tv"
                          ? clickedBox.name
                          : clickedBox.title}
                      </BigTitle>
                      <BigOverview>{clickedBox.overview}</BigOverview>
                      <BigAverage>
                        vote average: {clickedBox.vote_average}
                      </BigAverage>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      ) : (
        <NoSearchData imgUrl={noSearchDataImage() || ""}>
          '{keyword}'검색 결과가 없습니다.
        </NoSearchData>
      )}
    </>
  );
}

export default SearchResult;
