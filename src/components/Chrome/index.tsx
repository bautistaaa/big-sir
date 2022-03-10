import { FC, FormEvent, useEffect, useRef, useState, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components/macro';
import { VscBrowser } from 'react-icons/vsc';
import { IoMdRefresh } from 'react-icons/io';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useAppContext } from '../../AppContext';
import ClearButton from '../../components/ClearButton';
import { LeftArrow, RightArrow } from './icons';

interface Bookmark {
  favico: string;
  url: string;
  title: string;
}
interface UrlInfo {
  url: string;
  title?: string;
}
const urlFactory = (url: string, title = ''): UrlInfo => {
  return {
    url: formattingUrl(url),
    title,
  };
};
const formattingUrl = (url: string): string => {
  if (/(http(s?)):\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
};
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
const Chrome: FC = (): JSX.Element => {
  const { current } = useAppContext();
  const themeContext = useContext(ThemeContext);
  const windowState = current.context.activeWindows.find(
    (x) => x.name === 'chrome'
  );
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
  const src = history[activeIndex];

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
    const { url: urlToFormat, title } = url;
    setHistory((history) => [...history, urlFactory(urlToFormat, title)]);
    setActiveIndex(history.length);
  };
  const handleBookmarkItemClick = (url: string, title: string) => {
    const urlInfo = { url, title };
    setHistory((history) => [...history, urlFactory(url, title)]);
    setActiveIndex(history.length);
    setUrl(urlInfo);
  };

  useEffect(() => {
    setUrl(history[activeIndex]);
  }, [activeIndex, setUrl, history]);
  useEffect(() => {
    if (windowState?.defaultUrl) {
      const urlInfo = {
        url: formattingUrl(windowState.defaultUrl as string),
        title: '',
      };
      setHistory((history) => [...history, urlInfo]);
      setActiveIndex(history.length);
      setUrl(urlInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowState?.defaultUrl]);

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
            <IoMdRefresh fill={themeContext.color} size={18} />
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
        {bookmarks.map(({ url, title }: Bookmark) => {
          return (
            <BookmarkItem
              key={url}
              onClick={() => handleBookmarkItemClick(url, title)}
            >
              <VscBrowser
                fill={themeContext.color}
                size={13}
                style={{ marginRight: '5px' }}
              />
              <BookmarkUrl>{title}</BookmarkUrl>
            </BookmarkItem>
          );
        })}
      </Bookmarks>

      <Content>
        <IFrame key={k} ref={iframeRef} src={src?.url}></IFrame>
        <ExternalLinkButton as="a" href={src?.url} target="_blank">
          <FaExternalLinkAlt color="white" size={20} />
        </ExternalLinkButton>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const TopBar = styled.div`
  height: 40px;
  background: ${({ theme }) => theme.chromeTopBarBackground};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
const BrowserBar = styled.div<{ title: string }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  background: ${({ theme }) => theme.chromeBrowserBarBackground};
  height: 30px;
  width: 100%;
  padding-right: 10px;
  &::before {
    content: '${({ title }) => `${title}`}';
    color: ${({ theme }) => theme.color};
    font-size: 12px;
    background: ${({ theme }) => theme.chromeBrowserBarBackground};
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
  background: ${({ theme }) => theme.chromeBrowserBarBackground};
  width: 100%;
  height: 30px;
  padding-left: 10px;
`;
const BookmarkItem = styled(ClearButton)`
  display: flex;
  align-items: flex-start;
  font-size: 11px;
  color: ${({ theme }) => theme.color};
  margin-right: 10px;
  border-radius: 20px;
  transition: background 0.3s;
  padding: 5px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
const BookmarkUrl = styled.div`
  display: inline-block;
`;
const Content = styled.div`
  background: white;
  flex: 1;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;
const IFrame = styled.iframe`
  border-radius: inherit;
  width: 100%;
  height: 100%;
`;
const Form = styled.form`
  width: 100%;
`;
const UrlBar = styled.input`
  color: ${({ theme }) => theme.color};
  height: 20px;
  width: 100%;
  font-size: 12px;
  background: ${({ theme }) => theme.chromeUrlInputBackground};
  border: 10px;
  border-radius: 30px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  outline: none;
  width: 100%;
`;
const ExternalLinkButton = styled(ClearButton)`
  display: block;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: black;
  padding: 8px 11px;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

export default Chrome;
