import { FC } from 'react';
import styled from 'styled-components';

interface Props {
  imageSrc: string;
  name?: string;
  description?: string;
}
const FeedCard: FC<Props> = ({ imageSrc, name, description }) => {
  return (
    <Wrapper>
      <div style={{ flex: '1' }}>
        <CardImage>
          <img src={imageSrc} alt="" />
        </CardImage>
        <Name>{name}</Name>
        <Name>{description}</Name>
      </div>
    </Wrapper>
  );
};

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
