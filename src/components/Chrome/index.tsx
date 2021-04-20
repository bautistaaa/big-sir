import { FC } from 'react';
import styled from 'styled-components/macro';

import { LeftArrow, RightArrow, Refresh as BaseRefresh } from './icons';

const Chrome: FC = () => {
  return (
    <Wrapper>
      <TopBar className="action-bar"></TopBar>
      <BrowserBar title="NANI TF!!!">
        <ActionButtonsWrapper>
          <LeftArrow />
          <RightArrow />
          <Refresh />
        </ActionButtonsWrapper>
        <UrlBar></UrlBar>
      </BrowserBar>
      <Content>
        <IFrame
          id="inlineFrameExample"
          title="Inline Frame Example"
          src="https://www.narutoql.com/"
        ></IFrame>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: calc(100% - 40px);
  width: 100%;
`;
const TopBar = styled.div`
  height: 40px;
  background: rgb(33, 33, 36);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
const BrowserBar = styled.div<{ title: string }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  background: rgb(56, 56, 56);
  height: 30px;
  width: 100%;
  &::before {
    content: '${({ title }) => `${title}`}';
    color: white;
    font-size: 12px;
    background: rgb(56, 56, 56);
    position: absolute;
    top: -31px;
    left: 80px;
    height: 31px;
    width: 150px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    align-items: center;
    padding-left: 10px;
  }
`;
const ActionButtonsWrapper = styled.div`
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  width: 100px;
`;
const UrlBar = styled.div`
  height: 20px;
  width: 100%;
  background: rgb(33, 33, 36);
  border: 10px;
  border-radius: 30px;
  margin-right: 10px;
`;
const Content = styled.div`
  height: calc(100% - 31px);
  width: 100%;
  background: white;
  flex: 1;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: scroll;
`;
const IFrame = styled.iframe`
  width: 100%;
  height: 100%;
`;
const Refresh = styled(BaseRefresh)`
  transform: scaleY(-1);
`;

export default Chrome;
