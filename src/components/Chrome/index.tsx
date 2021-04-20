import { FC } from 'react';
import styled from 'styled-components/macro';

const Chrome: FC = () => {
  return (
    <Wrapper>
      <TopBar>
        <UtilBar></UtilBar>
        <BrowserBar></BrowserBar>
      </TopBar>
      <Content>asdasdasdasdasd</Content>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
const TopBar = styled.div``;
const UtilBar = styled.div``;
const BrowserBar = styled.div``;
const Content = styled.div`
  height: calc(100% - 22px);
  width: 100%;
  background: #151516;
  flex: 1;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: scroll;
`;

export default Chrome;
