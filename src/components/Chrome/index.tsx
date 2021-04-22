import { FC, FormEvent, memo, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import ClearButton from '../../components/ClearButton';
import { LeftArrow, RightArrow, Refresh as BaseRefresh } from './icons';

interface Bookmark {
  favico: string;
  url: string;
}
const bookmarks: Bookmark[] = [
  { url: 'https://www.narutoql.com', favico: 'favico.svg' },
  { url: 'https://spotify-city.netlify.app', favico: 'favico.svg' },
  {
    url: 'https://bautistaaa.github.io/react-coverfl0w/index.html',
    favico: 'favico.svg',
  },
];

const Chrome: FC = memo(
  () => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);
    const [url, setUrl] = useState('https://www.tailwindcss.com');
    const [history, setHistory] = useState(['https://www.tailwindcss.com']);
    const src = history[history.length - 1];

    const handleRefreshClick = () => {};
    const handleForwardClick = () => {};
    const handlePreviousClick = () => {};
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setHistory((history) => [...history, url]);
    };
    const handleBookmarkItemClick = (url: string) => {
      setHistory((history) => [...history, url]);
    };

    return (
      <Wrapper ref={wrapperRef}>
        <TopBar className="action-bar"></TopBar>
        <BrowserBar title="NANI TF!!!">
          <ActionButtonsWrapper>
            <ClearButton onClick={handlePreviousClick}>
              <LeftArrow />
            </ClearButton>
            <ClearButton onClick={handleForwardClick}>
              <RightArrow />
            </ClearButton>
            <ClearButton onClick={handleRefreshClick}>
              <Refresh />
            </ClearButton>
          </ActionButtonsWrapper>
          <Form onSubmit={handleSubmit}>
            <UrlBar
              ref={hiddenInputRef}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
          </Form>
        </BrowserBar>
        <Bookmarks>
          {bookmarks.map(({ url, favico }: Bookmark) => {
            return (
              <BookmarkItem onClick={() => handleBookmarkItemClick(url)}>
                <BookmarkFavIcon src={favico} />
                <BookmarkUrl>{url}</BookmarkUrl>
              </BookmarkItem>
            );
          })}
        </Bookmarks>

        <Content>
          <IFrame src={src}></IFrame>
        </Content>
      </Wrapper>
    );
  },
  () => true
);

const Wrapper = styled.div`
  height: calc(100% - 70px);
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
  padding-right: 10px;
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
const Bookmarks = styled.div`
  display: flex;
  align-items: center;
  background: rgb(56, 56, 56);
  width: 100%;
  height: 30px;
  padding-left: 10px;
`;
const BookmarkItem = styled(ClearButton)`
  display: flex;
  align-items: center;
  font-size: 10px;
  color: white;
  margin-right: 10px;
  border-radius: 20px;
  transition: background 0.3s;
  padding: 5px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
const BookmarkFavIcon = styled.img`
  height: 15px;
  width: 15px;
  margin-right: 5px;
`;
const BookmarkUrl = styled.div`
  display: inline-block;
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
const Form = styled.form`
  width: 100%;
`;
const UrlBar = styled.input`
  color: white;
  height: 20px;
  width: 100%;
  font-size: 12px;
  background: rgb(33, 33, 36);
  border: 10px;
  border-radius: 30px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  outline: none;
  width: 100%;
`;

export default Chrome;
