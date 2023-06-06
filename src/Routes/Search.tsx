import { useLocation } from "react-router-dom";
import styled from "styled-components";
import SearchResult from "./SearchResult";

const Wrapper = styled.div`
  padding: 150px 60px;
`;

const TopWrap = styled.div`
  margin-bottom: 20px;
`;

const Notice = styled.p`
  font-size: 25px;
  font-weight: 400;
`;

const BottomWrap = styled.div``;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  return (
    <Wrapper>
      <TopWrap>
        <Notice>'{keyword}' (으)로 검색한 결과</Notice>
      </TopWrap>
      <BottomWrap>{keyword && <SearchResult keyword={keyword} />}</BottomWrap>
    </Wrapper>
  );
}

export default Search;
