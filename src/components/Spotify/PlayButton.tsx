import { FC } from 'react';

import { MdPause, MdPlayArrow } from 'react-icons/md';
import styled from 'styled-components/macro';

type ButtonType = 'default' | 'inverse';
interface Props {
  isPlaying: boolean;
  onClick(): void;
  size: 'small' | 'medium' | 'large';
  type: ButtonType;
}
const PlayButton: FC<Props> = ({ isPlaying, onClick, size, type }) => {
  const fillColor = type === 'default' ? 'white' : 'black';
  return (
    <Wrapper onClick={onClick} size={size} buttonType={type}>
      {isPlaying ? (
        <MdPause color={fillColor} size={40} />
      ) : (
        <MdPlayArrow color={fillColor} size={40} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.button<{ buttonType: ButtonType; size: string }>`
  z-index: 100;
  border: none;
  box-shadow: 0 8px 8px rgb(0 0 0 / 30%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 500px;
  ${({ buttonType }) =>
    buttonType === 'default'
      ? ` 
        background-color: #1db954;
        color: #fff;
      `
      : `
        background-color: #fff;
        color: #fff;
  `}
  ${({ size }) =>
    size === 'small' &&
    ` 
  width: 20px;
  height: 20px;
    `}
  ${({ size }) =>
    size === 'medium' &&
    ` 
  width: 32px;
  height: 32px;
    `}
  ${({ size }) =>
    size === 'large' &&
    ` 
  width: 55px;
  height: 55px;
    `}
`;

export default PlayButton;
