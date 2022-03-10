import { FC, MutableRefObject } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../AppContext';
import { AppType } from '../shared/app-configs';

interface DockItem {
  name: AppType;
  path: string;
}
const minimizedImages: { [k: string]: string } = {
  chrome: 'minimized.png',
  finder: 'finder-min.png',
  terminal: 'minimized.png',
  aboutThisMac: 'about-min.png',
  aboutThisDeveloper: 'about-min.png',
  spotify: 'spotify.svg',
};
const items: DockItem[] = [
  {
    name: 'finder',
    path: './finder.png',
  },
  {
    name: 'terminal',
    path: './iterm.png',
  },
  {
    name: 'chrome',
    path: './chrome.png',
  },
  {
    name: 'spotify',
    path: './spotify.svg',
  },
];

const Dock: FC<{
  minimizedTargetRef: MutableRefObject<HTMLDivElement | null>;
}> = ({ minimizedTargetRef }) => {
  const { current, send } = useAppContext();

  return (
    <Wrapper>
      <ContentWrapper>
        <IconsContainer>
          {items.map((item: DockItem) => {
            const { name, path } = item;
            return (
              <Button
                active={
                  !!current.context.activeWindows.find((aw) => aw.name === name)
                }
                key={name}
                onClick={() => {
                  send('FOCUS_WINDOW', { payload: { name } });
                }}
              >
                <img src={path} alt={name} />
              </Button>
            );
          })}
          <Button
            key="github"
            onClick={() => {
              window.open('https://github.com/bautistaaa/big-sir', '_blank');
            }}
          >
            <img src="github.png" alt="" />
          </Button>
        </IconsContainer>
        <TrashContainer>
          <Separator ref={minimizedTargetRef} />
          {current.context.minimizedWindows.map(({ name }) => {
            const imgSrc = minimizedImages[name];
            const handleMinimizedWindowClick = () => {
              send({
                type: 'FOCUS_WINDOW',
                payload: { name },
              });
            };
            if (imgSrc) {
              return (
                <MinimizedWindow
                  key={name}
                  onClick={handleMinimizedWindowClick}
                >
                  <img src={imgSrc} alt="" />
                </MinimizedWindow>
              );
            }

            return null;
          })}
          <Button>
            <img src="./trash.png" alt="Trash" />
          </Button>
        </TrashContainer>
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  position: absolute;
  bottom: 5px;
  left: 0;
  z-index: 1000;
`;
const MinimizedWindow = styled.div`
  img {
    width: 40px;
    height: 31px;
    object-fit: contain;
    margin-right: 5px;
  }
`;
const Separator = styled.div`
  height: 100%;
  width: 1px;
  background: ${({ theme }) => theme.dockSeparator};
  margin-right: 10px;
`;
const BaseContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const IconsContainer = styled(BaseContainer)``;
const TrashContainer = styled(BaseContainer)``;
const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  height: 50px;
  width: 30%;
  padding: 7px;
  background: ${({ theme }) => theme.dockBackground};
  backdrop-filter: blur(5px);
  box-shadow: inset 0px 0px 0px 0.2px rgb(255 255 255 / 35%);
`;
const Button = styled.button<{ active?: boolean }>`
  position: relative;
  background: none;
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
  width: 40px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  ${({ active }) =>
    active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 3px;
      left: 44%;
    }
  `}
`;

export default Dock;
