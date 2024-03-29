import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import ReactStars from "react-stars";
import styled from "styled-components";
import { getDetailData } from "../Routes/api";
import { makeImagePath } from "../Routes/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  overflow-y: scroll;
  position: fixed;
  top: 10vh;
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
  //줄거리가 모달 밖으로 넘어갔을때 스크롤바 생기게
  overflow-y: auto;
  //스크롤바 스타일 커스텀
  ::-webkit-scrollbar {
    width: 7px; /* 스크롤바의 너비 */
  }
  ::-webkit-scrollbar-thumb {
    height: 30%; /* 스크롤바의 길이 */
    background: #4e4e4e; /* 스크롤바의 색상 */
    border-radius: 10px;
  }
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 350px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 35px;
  height: 35px;
  border: none;
  padding: 0px;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
  .svg-inline--fa {
    /* 아이콘에 대한 스타일 지정 */
    width: 100%; // 아이콘을 수평으로 꽉 채우기
    height: 100%; // 아이콘을 수직으로 꽉 채우기
  }
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

interface IModal {
  dataId: string;
  mediaType: string;
  listType?: string;
}

function Modal({ dataId, mediaType, listType }: IModal) {
  const { data } = useQuery(
    [listType + dataId, "datail" + dataId],
    () => getDetailData(mediaType, dataId) || null
  );
  //const { scrollY } = useScroll();
  const history = useHistory();
  // const onMovieOverlayClick = () => history.push("/");
  // const onTvOverlayClick = () => history.push("/tv");
  const onOverlayClick = () => history.goBack();

  const getYear = (date: string) => {
    if (date) {
      return date.split("-")[0];
    } else {
      return "";
    }
  };

  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <BigMovie
        layoutId={dataId + (listType === "airingToday" ? "airing" : "")}
      >
        <BigCover
          style={{
            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
              data?.backdrop_path,
              "w500"
            )})`,
          }}
        >
          <CloseButton onClick={onOverlayClick}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </CloseButton>
        </BigCover>
        <BigPoster>
          <img
            src={makeImagePath(data?.poster_path || "", "w500")}
            alt="poster"
          />
        </BigPoster>
        <BigInfoTitle>
          <BigTitle>{data?.title}</BigTitle>
          <BigTitleSmall>{data?.original_title}</BigTitleSmall>
        </BigInfoTitle>
        <BigInfo>
          <BigInfoItem>{getYear(data?.release_date)} &#183;</BigInfoItem>
          <BigAverage>
            {data?.vote_average ? (
              <li>
                <ReactStars
                  count={5}
                  value={data?.vote_average ? data?.vote_average / 2 : 0}
                  size={23}
                  color2={"#ffd700"}
                  edit={false}
                />
                <span className="ratingValue">
                  ({data?.vote_average.toFixed(1)})
                </span>
              </li>
            ) : null}
          </BigAverage>
        </BigInfo>
        <div>
          <BigOverview>{data?.overview}</BigOverview>
        </div>
      </BigMovie>
    </>
  );
}

export default Modal;
