import { FC } from 'react';
import styled from 'styled-components/macro';
import { MdPlayArrow } from 'react-icons/md';

interface Props {
  imageSrc: string;
  name?: string;
  description?: string;
  onClick(): void;
  onPlayButtonClick?: () => void;
}
const FeedCard: FC<Props> = ({
  imageSrc,
  name,
  description,
  onClick,
  onPlayButtonClick,
}) => {
  return (
    <Wrapper onClick={onClick}>
      <CardImage>
        <img src={imageSrc} alt="" />
        <ButtonWrapper>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayButtonClick?.();
            }}
          >
            <MdPlayArrow color="white" size={40} />
          </button>
        </ButtonWrapper>
      </CardImage>
      <Name>{name}</Name>
      <Name>{description}</Name>
    </Wrapper>
  );
};

const ButtonWrapper = styled.div`
  opacity: 0;
  pointer-events: all;
  transition: opacity 0.3s ease;
  position: absolute;
  right: 10px;
  bottom: 10px;
  button {
    z-index: 100;
    border: none;
    box-shadow: 0 8px 8px rgb(0 0 0 / 30%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 500px;
    background-color: #1db954;
    color: #fff;
    width: 40px;
    height: 40px;
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #181818;
  padding: 15px 15px 30px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background: #282828;
    ${ButtonWrapper} {
      opacity: 1;
      &:hover {
        button {
          transform: scale(1.06);
        }
      }
    }
  }
`;
const CardImage = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 30px;
  img {
    pointer-events: none;
    -webkit-backface-visibility: hidden;
    -webkit-transform: translateZ(0) scale(1, 1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;
const Name = styled.div`
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

export default FeedCard;
