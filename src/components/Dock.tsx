import { FC, MutableRefObject } from 'react';
import styled from 'styled-components/macro';
import { useAppContext } from '../AppContext';
import { AppType } from '../shared/configs';

interface DockItem {
  name: AppType;
  path: string;
}
const minimizedImages: { [k: string]: string } = {
  finder: 'finder-min.png',
  terminal: 'minimized.png',
  aboutThisMac: 'about-min.png',
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
  // {
  //   name: 'spotify',
  //   path: './spotify.svg',
  // },
];

const Dock: FC<{
  terminalRef: MutableRefObject<HTMLDivElement | null>;
  finderRef: MutableRefObject<HTMLDivElement | null>;
  minimizedTargetRef: MutableRefObject<HTMLDivElement | null>;
}> = ({ terminalRef, finderRef, minimizedTargetRef }) => {
  const { state, dispatch } = useAppContext();


  return (
    <Wrapper>
      <ContentWrapper>
        <IconsContainer>
          {items.map((item: DockItem) => {
            const { name, path } = item;
            return (
              <Button
                active={!!state.activeWindows.find((aw) => aw.name === name)}
                key={name}
                onClick={() =>
                  dispatch({
                    type: 'focusWindow',
                    payload: { name },
                  })
                }
              >
                <img src={path} alt={name} />
              </Button>
            );
          })}
        </IconsContainer>
        <TrashContainer>
          <Separator ref={minimizedTargetRef} />
          {state.minimizedWindows.map(({ name }) => {
            const imgSrc = minimizedImages[name];
            const handleMinimizedWindowClick = () => {
              dispatch({
                type: 'unminimizedWindow',
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
  background: rgba(255, 255, 255, 0.3);
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
  background: rgb(51 51 51 / 23%);
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
