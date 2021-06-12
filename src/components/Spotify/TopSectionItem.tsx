import { FC } from 'react';
import { MdPlayArrow } from 'react-icons/md';
import styled from 'styled-components';

const TopSectionItem: FC<{ item: SpotifyApi.AlbumObjectSimplified }> = ({
  item,
}) => {
  return (
    <IntroSectionItem>
      <AlbumArt>
        <img src={item?.images?.[2]?.url} alt="" />
      </AlbumArt>
      <Metadata>
        <Title>{item?.name}</Title>
        <ButtonWrapper>
          <button>
            <MdPlayArrow color="white" size={40} />
          </button>
        </ButtonWrapper>
      </Metadata>
    </IntroSectionItem>
  );
};

const ButtonWrapper = styled.div`
  opacity: 0;
  pointer-events: all;
  transition: opacity 0.3s ease;
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
const IntroSectionItem = styled.div`
  display: flex;
  background-color: hsla(0, 0%, 100%, 0.1);
  border-radius: 4px;
  height: 80px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    background-color: #ffffff33;
    ${ButtonWrapper} {
      opacity: 1;
      &:hover {
        button {
          transform: scale(1.06);
        }
      }
    }
  }
  transition: background-color 0.3s ease;
`;
const AlbumArt = styled.div`
  height: 100%;
  width: 80px;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const Metadata = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  flex: 1;
`;
const Title = styled.div`
  -webkit-line-clamp: 2;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.6px;
  flex: 1;
  white-space: nowrap;
  white-space: normal;
  word-break: break-word;
  overflow: hidden;
`;

export default TopSectionItem;
