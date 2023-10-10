import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
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
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
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
  margin-left: 40px;
  margin-right: 40px;
`;

const NextButton = styled.div`
  position: absolute;
  right: -25px;
  top: 100px;
  border-radius: 7.5px;
  &:hover {
    cursor: pointer;
    scale: 1.7;
  }
`;

const PrevButton = styled.div`
  position: absolute;
  left: -25px;
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

const rowVariants = {
  //next 버튼 눌렀을때 애니메이션
  nextHidden: {
    x: window.innerWidth + 5,
  },
  nextVisible: {
    x: 0,
  },
  nextExit: {
    x: -window.innerWidth - 5,
  },
  //prev 버튼 눌렀을때 애니메이션
  prevHidden: {
    x: -window.innerWidth - 5,
  },
  prevVisible: {
    x: 0,
  },
  prevExit: {
    x: window.innerWidth + 5,
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
  //const { scrollY } = useScroll();
  const history = useHistory();
  // 라우터 매치 (Latest Movies, Top Rated Movies, Upcoming Movies)
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const topBigMovieMatch = useRouteMatch<{ movieId: string }>(
    "/movies/top_rated/:movieId"
  );
  const upBigMovieMatch = useRouteMatch<{ movieId: string }>(
    "/movies/upcoming/:movieId"
  );

  // 리액트 쿼리로 data 불러옴 (Latest Movies, Top Rated Movies, Upcoming Movies)
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
  // next 버튼 누르면 true, prev 버튼 누르면 false
  const [direction, setDirection] = useState(true);
  const [topDirection, setTopDirection] = useState(true);
  const [upcomingDirection, setUpcomingDirection] = useState(true);

  //slider 애니메이션 효과에 텀을 두기 위한 state
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  //slider Index 증가 function (Latest Movies, Top Rated Movies, Upcoming Movies)
  const increaseIndex = () => {
    if (nowPlaying) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const topIncreaseIndex = () => {
    if (topRated) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const upcomingIncreaseIndex = () => {
    if (upcoming) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upcoming.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  //slider Index 감소 function (Latest Movies, Top Rated Movies, Upcoming Movies)
  const decreaseIndex = () => {
    if (nowPlaying) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const minIndex = 0;
      setIndex((prev) => (prev === minIndex ? maxIndex : prev - 1));
    }
  };
  const topDecreaseIndex = () => {
    if (topRated) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const minIndex = 0;
      setTopIndex((prev) => (prev === minIndex ? maxIndex : prev - 1));
    }
  };
  const upcomingDecreaseIndex = () => {
    if (upcoming) {
      if (leaving) return;
      toggleLeaving();
      setUpcomingDirection(false);
      const totalMovies = upcoming.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const minIndex = 0;
      setUpcomingIndex((prev) => (prev === minIndex ? maxIndex : prev - 1));
    }
  };

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

  // 클릭한 영화의 개별 데이터 (개별영화 불러오는 api 사용해서 필요없어짐)
  // const clickedMovie =
  //   bigMovieMatch?.params.movieId &&
  //   nowPlaying?.results.find(
  //     (movie) => movie.id + "" === bigMovieMatch.params.movieId
  //   );
  // const topClickMovie =
  //   topBigMovieMatch?.params.movieId &&
  //   topRated?.results.find(
  //     (movie) => movie.id + "" === topBigMovieMatch.params.movieId
  //   );
  // const upClickMovie =
  //   upBigMovieMatch?.params.movieId &&
  //   upcoming?.results.find(
  //     (movie) => movie.id + "" === upBigMovieMatch.params.movieId
  //   );

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
          {/* 1. Latest Movies slider */}
          <Slider style={{ top: -230 }}>
            <Category>Latest Movies</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial={direction ? "nextHidden" : "prevHidden"}
                animate={direction ? "nextVisible" : "prevVisible"}
                exit={direction ? "nextExit" : "prevExit"}
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
            <NextButton
              onClick={() => {
                // 애니메이션 방향을 변경하고, 새로운 애니메이션을 시작
                setDirection(true);
                setTimeout(() => {
                  increaseIndex();
                }, 0); // 0ms 딜레이로 설정
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
            <PrevButton
              onClick={() => {
                // 애니메이션 방향을 변경하고, 새로운 애니메이션을 시작
                setDirection(false);
                setTimeout(() => {
                  decreaseIndex();
                }, 0); // 0ms 딜레이로 설정
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
            </PrevButton>
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
                initial={topDirection ? "nextHidden" : "prevHidden"}
                animate={topDirection ? "nextVisible" : "prevVisible"}
                exit={topDirection ? "nextExit" : "prevExit"}
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
            <NextButton
              onClick={() => {
                //애니메이션 방향을 변경하고, 새로운 애니메이션을 시작
                setTopDirection(true);
                setTimeout(() => {
                  topIncreaseIndex();
                }, 0); // 0ms 딜레이로 설정
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
            <PrevButton
              onClick={() => {
                // // 애니메이션 방향을 변경하고, 새로운 애니메이션을 시작
                setTopDirection(false);
                setTimeout(() => {
                  topDecreaseIndex();
                }, 0); // 0ms 딜레이로 설정
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
            </PrevButton>
          </Slider>
          {/* 2. Top Rated Movies 모달창 */}
          <AnimatePresence>
            {topBigMovieMatch ? (
              <Modal
                dataId={topBigMovieMatch.params.movieId}
                mediaType={"movie"}
                listType={LIST_TYPE[1]}
              />
            ) : null}
          </AnimatePresence>
          {/* 3. Upcoming Movies */}
          <Slider style={{ top: 170 }}>
            <Category>Upcoming Movies</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial={upcomingDirection ? "nextHidden" : "prevHidden"}
                animate={upcomingDirection ? "nextVisible" : "prevVisible"}
                exit={upcomingDirection ? "nextExit" : "prevExit"}
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
                      layoutId={movie.id + ""}
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
            <NextButton
              onClick={() => {
                setUpcomingDirection(true);
                setTimeout(() => {
                  upcomingIncreaseIndex();
                }, 0);
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
            <PrevButton
              onClick={() => {
                setUpcomingDirection(false);
                setTimeout(() => {
                  upcomingDecreaseIndex();
                }, 0);
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
            </PrevButton>
          </Slider>
          {/* 3. Upcoming Movies 모달창 */}
          <AnimatePresence>
            {upBigMovieMatch ? (
              <Modal
                dataId={upBigMovieMatch.params.movieId}
                mediaType={"movie"}
                listType={LIST_TYPE[2]}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
