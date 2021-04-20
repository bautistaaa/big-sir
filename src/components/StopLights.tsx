import { FC } from 'react';
import styled from 'styled-components/macro';
import { RED, YELLOW, GREEN } from '../shared/constants';

const StopLights: FC<{
  variant: string;
  handleCloseClick(args: unknown): void;
  handleMinimizeClick(args: unknown): void;
  handleMaximizeClick(args: unknown): void;
  className?: string;
}> = ({
  variant,
  handleCloseClick,
  handleMinimizeClick,
  handleMaximizeClick,
  className,
}) => {
  return (
    <Wrapper className={`${className ?? ''}`} variant={variant}>
      <CloseButton onClick={handleCloseClick} />
      <MinimizeButton onClick={handleMinimizeClick} />
      <FullScreenButton onClick={handleMaximizeClick} />
    </Wrapper>
  );
};

const Wrapper = styled.div<{ variant: string }>`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 30px;
  padding: 7px;
  z-index: 500;
  ${({ variant }) =>
    variant === 'aboutThisMac' &&
    `
    top: 6px;
    left: 6px;
    `}
  ${({ variant }) =>
    variant === 'finder' &&
    `
    top: 10px;
    left: 10px;
    `}
  ${({ variant }) =>
    variant === 'chrome' &&
    `
    top: 5px;
    left: 10px;
    `}
`;
const BaseButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  height: 12px;
  width: 12px;
  & + & {
    margin-left: 5px;
  }
`;
const CloseButton = styled(BaseButton)`
  background: ${RED};
`;
const MinimizeButton = styled(BaseButton)`
  background: ${YELLOW};
`;
const FullScreenButton = styled(BaseButton)`
  background: ${GREEN};
`;

export default StopLights;
