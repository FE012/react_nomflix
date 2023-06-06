import { useQuery } from "@tanstack/react-query";
import { motion, useScroll } from "framer-motion";
import { useHistory } from "react-router-dom";
import ReactStars from "react-stars";
import styled from "styled-components";
import { getDetailData } from "../Routes/api";
import { makeImagePath } from "../Routes/util";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
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

interface IModal {
  dataId: string;
  mediaType: string;
  listType: string;
}

function Modal({ dataId, mediaType, listType }: IModal) {
  const { data, isLoading } = useQuery(
    [listType + dataId, "datail" + dataId],
    () => getDetailData(mediaType, dataId) || null
  );
  console.log(data, mediaType, dataId);
  const { scrollY } = useScroll();
  console.log(scrollY.get());
  const history = useHistory();
  const onOverlayClick = () => history.push("/");
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

      <BigMovie layoutId={dataId} style={{}}>
        <BigCover
          style={{
            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
              data?.backdrop_path,
              "w500"
            )})`,
          }}
        />
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
