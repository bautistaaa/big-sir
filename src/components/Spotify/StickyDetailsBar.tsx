import { useSelector } from '@xstate/react';
import { FC } from 'react';
import styled from 'styled-components/macro';

import { SelectorState } from './spotify.machine';
import { useSpotifyContext } from './SpotifyContext';

const selectHeaderState = (state: SelectorState) => state.context.headerState;

const StickyDetailsBar: FC = () => {
  const service = useSpotifyContext();
  const headerState = useSelector(service, selectHeaderState);
  return (
    <Wrapper
      className="action-bar"
      background={headerState.backgroundColor}
      opacity={headerState.opacity}
    >
      <Text>{headerState.text}</Text>
    </Wrapper>
  );
};

const Wrapper = styled.header<{ background: string; opacity: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  grid-area: main;
  height: 60px;
  padding: 16px 32px;
  opacity: 0;
  z-index: 100;
  border-top-right-radius: 10px;
  ${({ background, opacity }) =>
    `
      background: ${background};
      opacity: ${opacity};
    `}
`;
const Text = styled.div`
  color: #fff;
  font-size: 24px;
  font-weight: 400;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  letter-spacing: 0.5px;
`;

export default StickyDetailsBar;
