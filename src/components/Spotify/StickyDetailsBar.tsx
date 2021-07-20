import { FC } from 'react';
import styled from 'styled-components/macro';

const StickyDetailsBar: FC<{
  opacity: number;
  backgroundColor: string;
}> = ({ children, opacity, backgroundColor }) => {
  return (
    <Wrapper
      className="action-bar"
      background={backgroundColor}
      opacity={opacity}
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.header<{ background?: string; opacity?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  grid-area: main;
  height: 60px;
  padding: 16px 32px;
  opacity: 0;
  z-index: 100;
  ${({ background, opacity }) =>
    `
      background: ${background};
      opacity: ${opacity};
    `}
`;

export default StickyDetailsBar;
