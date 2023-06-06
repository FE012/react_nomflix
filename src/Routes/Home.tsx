import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  getMovies,
  getTopMovies,
  getUpcomingMovies,
  IGetMoviesResult,
  IGetTopMoviesResult,
  LIST_TYPE,
} from "./api";
import { makeImagePath } from "./util";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-stars";
import Modal from "../Components/Modal";

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
  font-size: 18px;
  width: 40%;
  line-height: 1.3em;
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

// Modal
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

// Modal
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
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

const BigPoster = styled.div`
  width: 25%;
  height: 200px;
  position: absolute;
  top: 200px;
  left: 30px;
  img {
    width: 100%;
  }
`;

const BigInfoTitle = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: absolute;
  top: 255px;
  left: 230px;
`;

const BigTitle = styled.h3`
  font-size: 34px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const BigTitleSmall = styled.h4`
  font-weight: 400;
`;

const BigInfo = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 360px;
  left: 230px;
  li {
    list-style: none;
    display: flex;
    align-items: center;
    .ratingValue {
      margin-left: 4px;
    }
  }
`;

const BigInfoItem = styled.h4``;

const BigAverage = styled.h4`
  margin: 10px;
`;

const BigOverview = styled.p`
  padding: 10px;
  position: absolute;
  top: 400px;
  left: 220px;
  color: ${(props) => props.theme.white.lighter};
  width: 65%;
  word-break: keep-all;
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

function Home() {
  const { scrollY } = useScroll();
  const history = useHistory();
  // 라우터 매치 (Latest Movies, Top Rated Movies, Upcoming Movies)
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const topBigMovieMatch = useRouteMatch<{ movieId: string }>(
    "/movies/top_rated/:movieId"
  );
  const upBigMovieMatch = useRouteMatch<{ movieId: string }>(
    "/movies/upcoming/:movieId"
  );
  console.log(bigMovieMatch);
  // 리액트 쿼리로 data 불러오기 (Latest Movies, Top Rated Movies, Upcoming Movies)
  const { data: nowPlaying, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: topRated } = useQuery<IGetTopMoviesResult>(
    ["movies", "topRated"],
    getTopMovies
  );
  const { data: upcoming } = useQuery<IGetTopMoviesResult>(
    ["movies", "upcoming"],
    getUpcomingMovies
  );

  //slider index 저장하기 (Latest Movies, Top Rated Movies, Upcoming Movies)
  const [index, setIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [direction, setDirection] = useState(false);
  const [topDirection, setTopDirection] = useState(false);
  const [upcomingDirection, setUpcomingDirection] = useState(false);

  //slider 애니메이션 효과에 텀을 두기 위한 state
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  //slider Index function (Latest Movies, Top Rated Movies, Upcoming Movies)
  const increaseIndex = () => {
    if (nowPlaying) {
      if (leaving) return;
      toggleLeaving();
      setDirection(true);
      const totalMovies = nowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  //Top Rated Movies Index function
  const topIncreaseIndex = () => {
    if (topRated) {
      if (leaving) return;
      toggleLeaving();
      setTopDirection(true);
      const totalMovies = topRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  //Upcoming Movies Index function
  const upcomingIncreaseIndex = () => {
    if (upcoming) {
      if (leaving) return;
      toggleLeaving();
      setUpcomingDirection(true);
      const totalMovies = upcoming.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  //Modal
  // slider의 영화를 클릭하면 url 추가되게 (Latest Movies, Top Rated Movies, Upcoming Movies)
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const topBoxClicked = (movieId: number) => {
    history.push(`/movies/top_rated/${movieId}`);
  };
  const upComingBoxClicked = (movieId: number) => {
    history.push(`/movies/upcoming/${movieId}`);
  };

  //Modal
  const onOverlayClick = () => history.push("/");

  // 클릭한 영화의 개별 데이터 (Latest Movies, Top Rated Movies, Upcoming Movies)
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    nowPlaying?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  const topClickMovie =
    topBigMovieMatch?.params.movieId &&
    topRated?.results.find(
      (movie) => movie.id + "" === topBigMovieMatch.params.movieId
    );
  const upClickMovie =
    upBigMovieMatch?.params.movieId &&
    upcoming?.results.find(
      (movie) => movie.id + "" === upBigMovieMatch.params.movieId
    );

  // 영화의 개봉년도만 자르는 함수
  const getYear = (date: string) => {
    if (date) {
      return date.split("-")[0];
    } else {
      return "";
    }
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Banner>
          {/* 1. Latest Movies */}
          <Slider style={{ top: -230 }}>
            <Category>Latest Movies</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {nowPlaying?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextButton onClick={increaseIndex}>
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
          </Slider>
          {/* 1. Latest movies 모달창 */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <Modal
                dataId={bigMovieMatch.params.movieId}
                mediaType={"movie"}
                listType={LIST_TYPE[0]}
              />
            ) : null}
          </AnimatePresence>

          {/* 2. Top Rated Movies */}
          <Slider style={{ top: -30 }}>
            <Category>Top Rated Movies</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topIndex}
              >
                {topRated?.results
                  .slice(1)
                  .slice(offset * topIndex, offset * topIndex + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => topBoxClicked(movie.id)}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextButton onClick={topIncreaseIndex}>
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
          </Slider>
          {/* 2. Top Rated Movies 모달 */}
          <AnimatePresence>
            {topBigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={topBigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {topClickMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            topClickMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{topClickMovie.title}</BigTitle>
                      <BigOverview>{topClickMovie.overview}</BigOverview>
                      <BigAverage>
                        vote average: {topClickMovie.vote_average}
                      </BigAverage>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
          {/* 3. Upcoming Movies */}
          <Slider style={{ top: 170 }}>
            <Category>Upcoming Movies</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={upcomingIndex}
              >
                {upcoming?.results
                  .slice(1)
                  .slice(
                    offset * upcomingIndex,
                    offset * upcomingIndex + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "3"}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => upComingBoxClicked(movie.id)}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextButton onClick={upcomingIncreaseIndex}>
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
          </Slider>
          {/* 3. Upcoming Movies 모달창 */}
          <AnimatePresence>
            {upBigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={upBigMovieMatch.params.movieId + "3"}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {upClickMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            upClickMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{upClickMovie.title}</BigTitle>
                      <BigOverview>{upClickMovie.overview}</BigOverview>
                      <BigAverage>
                        {" "}
                        vote average: {upClickMovie.vote_average}
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

export default Home;
