import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { makeImagePath } from "./util";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getAiringTv, getPopularTv, getTopRatedTv } from "./api";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 160px 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 50px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 40%;
`;

const Category = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-left: 5px;
`;

const Slider = styled.div`
  position: relative;
`;

const NextButton = styled.div`
  position: absolute;
  right: 10px;
  top: 100px;
  border-radius: 7.5px;
  &:hover {
    cursor: pointer;
    scale: 1.7;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 150px;
  font-size: 66px;
  border-radius: 2.5px;
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

const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
};

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
const offset = 6;

function Tv() {
  const { scrollY } = useScroll();
  const history = useHistory();

  //Airing Tv
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/airing/:tvId");
  //Popular Tv
  const popularBigTvMatch = useRouteMatch<{ tvId: string }>(
    "/tv/popular/:tvId"
  );
  //Top Rated Tv
  const topRatedBigTvMatch = useRouteMatch<{ tvId: string }>(
    "/tv/top_rated/:tvId"
  );

  const useMultipleQuery = () => {
    // const latest = useQuery(["latest"], getLatestTv);
    const airing = useQuery(["airing"], getAiringTv);
    const popular = useQuery(["popular"], getPopularTv);
    const topRated = useQuery(["topRated"], getTopRatedTv);

    return [airing, popular, topRated];
  };

  const [
    // { isLoading: loadingLatest, data: latestData },
    { isLoading: loadingAiring, data: airingData },
    { data: popularData },
    { data: topRatedData },
  ] = useMultipleQuery();

  //Airing Tv
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(false);
  //Popular Tv
  const [popularIndex, setPopularIndex] = useState(0);
  const [popularDirection, setPopularDirection] = useState(false);
  //Top Rated Tv
  const [topIndex, setTopIndex] = useState(0);
  const [topDirection, setTopDirection] = useState(false);

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  // Airing Tv Index function
  const increaseIndex = () => {
    if (airingData) {
      if (leaving) return;
      toggleLeaving();
      setDirection(true);
      const totalMovies = airingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  //Popular Tv Index function
  const popularIncreaseIndex = () => {
    if (popularData) {
      if (leaving) return;
      toggleLeaving();
      setPopularDirection(true);
      const totalMovies = popularData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  //Top Rated Index function
  const topIncreaseIndex = () => {
    if (topRatedData) {
      if (leaving) return;
      toggleLeaving();
      setTopDirection(true);
      const totalMovies = topRatedData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  //Airing Tv
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/airing/${tvId}`);
  };

  //Popular Tv
  const popularBoxClicked = (tvId: number) => {
    history.push(`/tv/popular/${tvId}`);
  };

  //Top Rated Tv
  const TopRatedBoxClicked = (tvId: number) => {
    history.push(`/tv/top_Rated/${tvId}`);
  };

  const onOverlayClick = () => history.push("/tv");

  //Airing Tv
  const clickedTv =
    bigTvMatch?.params.tvId &&
    airingData?.results.find(
      (tv: any) => tv.id + "" === bigTvMatch.params.tvId
    );

  //Popular Tv
  const popularClickTv =
    popularBigTvMatch?.params.tvId &&
    popularData?.results.find(
      (tv: any) => tv.id + "" === popularBigTvMatch.params.tvId
    );

  //Top Rated Tv
  const topClickTv =
    topRatedBigTvMatch?.params.tvId &&
    topRatedData?.results.find(
      (tv: any) => tv.id + "" === topRatedBigTvMatch.params.tvId
    );

  return (
    <Wrapper>
      {loadingAiring ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(airingData?.results[0].backdrop_path || "")}
          >
            <Title>{airingData?.results[0].name}</Title>
            <Overview>{airingData?.results[0].overview}</Overview>
          </Banner>
          <Slider style={{ top: -220 }}>
            <Category>Airing today</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.8 }}
                key={index}
              >
                {airingData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv: any) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(tv.id)}
                      bgphoto={makeImagePath(tv?.backdrop_path, "w400")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextButton onClick={increaseIndex}>
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
          </Slider>
          {/* Airing 모달 */}
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigTvMatch.params.tvId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                      <BigAverage>
                        vote average: {clickedTv.vote_average}
                      </BigAverage>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
          {/* 2.Top Rated Tv */}
          <Slider style={{ top: 0 }}>
            <Category>Top Rated </Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topIndex}
              >
                {topRatedData?.results
                  .slice(1)
                  .slice(offset * topIndex, offset * topIndex + offset)
                  .map((tv: any) => (
                    <Box
                      layoutId={tv.id + "3"}
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => TopRatedBoxClicked(tv.id)}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextButton onClick={topIncreaseIndex}>
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
          </Slider>
          {/*Top Rated 모달창 */}
          <AnimatePresence>
            {topRatedBigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={topRatedBigTvMatch.params.tvId + "3"}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {topClickTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            topClickTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{topClickTv.name}</BigTitle>
                      <BigOverview>{topClickTv.overview}</BigOverview>
                      <BigAverage>
                        vote average: {topClickTv.vote_average}
                      </BigAverage>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
          {/* 3.Popular Tv */}
          <Slider style={{ top: 220 }}>
            <Category>Popular </Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popularIndex}
              >
                {popularData?.results
                  .slice(1)
                  .slice(offset * popularIndex, offset * popularIndex + offset)
                  .map((tv: any) => (
                    <Box
                      layoutId={tv.id + "2"}
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => popularBoxClicked(tv.id)}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextButton onClick={popularIncreaseIndex}>
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
          </Slider>
          {/* 3.Popular Tv 모달 */}
          <AnimatePresence>
            {popularBigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={popularBigTvMatch.params.tvId + "2"}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {popularClickTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            popularClickTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{popularClickTv.name}</BigTitle>
                      <BigOverview>{popularClickTv.overview}</BigOverview>
                      <BigAverage>
                        vote average: {popularClickTv.vote_average}
                      </BigAverage>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
