import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "./util";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { getAiringTv, getPopularTv, getTopRatedTv, LIST_TYPE } from "./api";
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

const PrevButton = styled.div`
  position: absolute;
  left: 10px;
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

function Tv() {
  const history = useHistory();
  // Tv 라우터 매치 (Airing Today, Top Rated Tv, Popular Tv)
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/airing/:tvId");
  const topRatedBigTvMatch = useRouteMatch<{ tvId: string }>(
    "/tv/top_rated/:tvId"
  );

  const popularBigTvMatch = useRouteMatch<{ tvId: string }>(
    "/tv/popular/:tvId"
  );

  // 3가지 api 한번에 불러오는 리액트 쿼리(useMultipleQuery)
  const useMultipleQuery = () => {
    const airing = useQuery(["airing"], getAiringTv);
    const popular = useQuery(["popular"], getPopularTv);
    const topRated = useQuery(["topRated"], getTopRatedTv);

    return [airing, popular, topRated];
  };

  const [
    { isLoading: loadingAiring, data: airingData },
    { data: popularData },
    { data: topRatedData },
  ] = useMultipleQuery();

  //slider index 저장하기 (Airing Today, Top Rated Tv, Popular Tv)
  const [index, setIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [direction, setDirection] = useState(true);
  const [topDirection, setTopDirection] = useState(true);
  const [popularDirection, setPopularDirection] = useState(true);

  //slider 애니메이션 효과에 텀을 두기 위한 state
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  //slider Index증가 function (Airing Tv, Top Rated Tv, Popular Tv)
  const increaseIndex = () => {
    if (airingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = airingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const topIncreaseIndex = () => {
    if (topRatedData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topRatedData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const popularIncreaseIndex = () => {
    if (popularData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = popularData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  //slider Index 감소 function (Airing Tv, Top Rated Tv, Popular Tv)
  const decreaseIndex = () => {
    if (airingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = airingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const minIndex = 0;
      setIndex((prev) => (prev === minIndex ? maxIndex : prev - 1));
    }
  };
  const topDecreaseIndex = () => {
    if (topRatedData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topRatedData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const minIndex = 0;
      setTopIndex((prev) => (prev === minIndex ? maxIndex : prev - 1));
    }
  };
  const popularDecreaseIndex = () => {
    if (popularData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = popularData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const minIndex = 0;
      setPopularIndex((prev) => (prev === minIndex ? maxIndex : prev - 1));
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

  //const onOverlayClick = () => history.push("/tv");

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
          {/* 1. Airing Today ㅊ*/}
          <Slider style={{ top: -220 }}>
            <Category>Airing today</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial={direction ? "nextHidden" : "prevHidden"}
                animate={direction ? "nextVisible" : "prevVisible"}
                exit={direction ? "nextExit" : "prevExit"}
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {airingData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv: any) => (
                    <Box
                      layoutId={tv.id + "airing"}
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
            <NextButton
              onClick={() => {
                setDirection(true);
                increaseIndex();
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
            <PrevButton
              onClick={() => {
                setDirection(false);
                decreaseIndex();
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
            </PrevButton>
          </Slider>
          {/* 1. Airing 모달창 */}
          <AnimatePresence>
            {bigTvMatch ? (
              <Modal
                dataId={bigTvMatch.params.tvId}
                mediaType={"tv"}
                listType={LIST_TYPE[3]}
              />
            ) : null}
          </AnimatePresence>

          {/* 2.Top Rated Tv Slider */}
          <Slider style={{ top: 0 }}>
            <Category>Top Rated </Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial={topDirection ? "nextHidden" : "prevHidden"}
                animate={topDirection ? "nextVisible" : "prevVisible"}
                exit={topDirection ? "nextExit" : "prevExit"}
                transition={{ type: "tween", duration: 1 }}
                key={topIndex}
              >
                {topRatedData?.results
                  .slice(1)
                  .slice(offset * topIndex, offset * topIndex + offset)
                  .map((tv: any) => (
                    <Box
                      layoutId={tv.id + ""}
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
            <NextButton
              onClick={() => {
                setTopDirection(true);
                topIncreaseIndex();
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
            <PrevButton
              onClick={() => {
                setTopDirection(false);
                topDecreaseIndex();
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
            </PrevButton>
          </Slider>
          {/*2. Top Rated 모달창 */}
          <AnimatePresence>
            {topRatedBigTvMatch ? (
              <Modal
                dataId={topRatedBigTvMatch.params.tvId}
                mediaType={"tv"}
                listType={LIST_TYPE[4]}
              />
            ) : null}
          </AnimatePresence>
          {/* 3.Popular Tv Slider */}
          <Slider style={{ top: 220 }}>
            <Category>Popular </Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial={popularDirection ? "nextHidden" : "prevHidden"}
                animate={popularDirection ? "nextVisible" : "prevVisible"}
                exit={popularDirection ? "nextExit" : "prevExit"}
                transition={{ type: "tween", duration: 1 }}
                key={popularIndex}
              >
                {popularData?.results
                  .slice(1)
                  .slice(offset * popularIndex, offset * popularIndex + offset)
                  .map((tv: any) => (
                    <Box
                      layoutId={tv.id + ""}
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
            <NextButton
              onClick={() => {
                setPopularDirection(true);
                popularIncreaseIndex();
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} size="2xl" />
            </NextButton>
            <PrevButton
              onClick={() => {
                setPopularDirection(false);
                popularDecreaseIndex();
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
            </PrevButton>
          </Slider>
          {/* 3.Popular Tv 모달 */}
          <AnimatePresence>
            {popularBigTvMatch ? (
              <Modal
                dataId={popularBigTvMatch.params.tvId}
                mediaType={"tv"}
                listType={LIST_TYPE[5]}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
