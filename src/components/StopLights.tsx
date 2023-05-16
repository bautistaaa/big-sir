import { FC } from 'react';
import styled from 'styled-components';
import { RED, YELLOW, GREEN, GREY } from '../shared/constants';

const StopLights: FC<{
  variant: string;
  handleCloseClick(args: unknown): void;
  handleMinimizeClick(args: unknown): void;
  handleMaximizeClick(args: unknown): void;
  className?: string;
  enableResizing: boolean;
}> = ({
  variant,
  handleCloseClick,
  handleMinimizeClick,
  handleMaximizeClick,
  className,
  enableResizing,
}) => {
  return (
    <Wrapper className={`${className ?? ''}`} variant={variant}>
      <CloseButton onClick={handleCloseClick} />
      <MinimizeButton onClick={handleMinimizeClick} />
      <FullScreenButton
        onClick={handleMaximizeClick}
        disabled={!enableResizing}
      />
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
    (variant === 'aboutThisMac' || variant === 'aboutThisDeveloper') &&
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
  ${({ variant }) =>
    variant === 'spotify' &&
    `
    top: 5px;
    left: 15px;
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
const FullScreenButton = styled(BaseButton)<{ disabled: boolean }>`
  background: ${GREEN};

  ${({ disabled }) =>
    disabled &&
    `
  background: ${GREY};
    `}
`;

export default StopLights;
