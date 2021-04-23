import { FC, FormEvent, memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { useAppContext } from '../../AppContext';
import ClearButton from '../../components/ClearButton';
import { LeftArrow, RightArrow, Refresh as BaseRefresh } from './icons';

interface Bookmark {
  favico: string;
  url: string;
  title: string;
}
interface UrlInfo {
  url: string;
  title?: string;
}
const bookmarks: Bookmark[] = [
  { url: 'https://www.narutoql.com', favico: 'favico.svg', title: 'NarutoQL' },
  {
    url: 'https://spotify-city.netlify.app',
    favico: 'favico.svg',
    title: 'Spotify City',
  },
  {
    url: 'https://bautistaaa.github.io/react-coverfl0w/index.html',
    favico: 'favico.svg',
    title: 'React Coverfl0w',
  },
];

const DEFAULT_URL = {
  url: 'https://www.google.com/webhp?igu=1',
  title: 'Google',
};
const Chrome: FC = memo(
  () => {
    const { state } = useAppContext();
    const windowState = state.activeWindows.find((x) => x.name === 'chrome');
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);
    const defaultUrl = windowState?.defaultUrl
      ? { url: windowState.defaultUrl ?? '', title: '' }
      : DEFAULT_URL;
    const [url, setUrl] = useState<UrlInfo>(defaultUrl);
    const [history, setHistory] = useState<UrlInfo[]>([defaultUrl]);
    const [activeIndex, setActiveIndex] = useState(history.length - 1);
    const [k, setK] = useState(Math.random());
    const hasPrevious = !!history[activeIndex - 1];
    const hasNext = !!history[activeIndex + 1];

    const handleRefreshClick = () => {
      setK(Math.random());
    };
    const handleForwardClick = () => {
      setActiveIndex((ai) => ai + 1);
    };
    const handlePreviousClick = () => {
      setActiveIndex((ai) => ai - 1);
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setHistory((history) => [...history, url]);
      setActiveIndex(history.length);
    };
    const handleBookmarkItemClick = (url: string, title: string) => {
      const urlInfo = { url, title };
      setHistory((history) => [...history, urlInfo]);
      setActiveIndex(history.length);
      setUrl(urlInfo);
    };

    useEffect(() => {
      setUrl(history[activeIndex]);
    }, [activeIndex, setUrl, history]);

    return (
      <Wrapper ref={wrapperRef}>
        <TopBar className="action-bar"></TopBar>
        <BrowserBar title={url.title ?? ''}>
          <ActionButtonsWrapper>
            <ClearButton onClick={handlePreviousClick} disabled={!hasPrevious}>
              <LeftArrow disabled={!hasPrevious} />
            </ClearButton>
            <ClearButton onClick={handleForwardClick} disabled={!hasNext}>
              <RightArrow disabled={!hasNext} />
            </ClearButton>
            <ClearButton onClick={handleRefreshClick}>
              <Refresh />
            </ClearButton>
          </ActionButtonsWrapper>
          <Form onSubmit={handleSubmit}>
            <UrlBar
              ref={hiddenInputRef}
              value={url.url}
              onChange={(e) => {
                setUrl({ url: e.target.value });
              }}
            />
          </Form>
        </BrowserBar>
        <Bookmarks>
          {bookmarks.map(({ url, favico, title }: Bookmark) => {
            return (
              <BookmarkItem
                key={url}
                onClick={() => handleBookmarkItemClick(url, title)}
              >
                <BookmarkFavIcon src={favico} />
                <BookmarkUrl>{url}</BookmarkUrl>
              </BookmarkItem>
            );
          })}
        </Bookmarks>

        <Content>
          <IFrame key={k} ref={iframeRef} src={url.url}></IFrame>
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
  font-size: 11px;
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
