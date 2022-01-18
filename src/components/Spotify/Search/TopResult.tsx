import styled from 'styled-components/macro';
import { MdPlayArrow } from 'react-icons/md';

import { Category } from './Category';
import { useSpotifyContext } from '../SpotifyContext';
import { useActor } from '@xstate/react';
interface TopResultProps {
  result: SpotifyApi.ArtistObjectFull;
}
const TopResult = ({ result }: TopResultProps) => {
  const service = useSpotifyContext();
  const [, send] = useActor(service);
  if (!result) {
    return null;
  }

  const handleClick = () => {
    send({
      type: 'ARTIST',
      payload: {
        artistId: result.id,
        view: 'artist',
      },
    });
  };

  return (
    <TopResultSection onClick={handleClick}>
      <Category>Top Result</Category>
      <TopResultContent>
        <Top>
          <img src={result.images?.[1]?.url} alt="artist" />
        </Top>
        <Bottom>
          <Metadata>
            <Name>{result.name}</Name>
            <Type>{result.type}</Type>
          </Metadata>
        </Bottom>
        <ButtonWrapper>
          <button>
            <MdPlayArrow color="white" size={40} />
          </button>
        </ButtonWrapper>
      </TopResultContent>
    </TopResultSection>
  );
};

const TopResultSection = styled.section`
  border-radius: 4px;
  grid-column: 1/3;
`;
const ButtonWrapper = styled.div`
  opacity: 0;
  pointer-events: all;
  transition: opacity 0.3s ease;
  position: absolute;
  right: 20px;
  bottom: 20px;
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
    width: 50px;
    height: 50px;
  }
`;
const TopResultContent = styled.div`
  position: relative;
  background: #181818;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  transition: 0.3s background;
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
  img {
    height: 92px;
    width: 92px;
    border-radius: 50%;
  }
`;
const Top = styled.div``;
const Bottom = styled.div``;
const Metadata = styled.div``;
const Name = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
  font-size: 32px;
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 36px;
`;
const Type = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 500px;
  color: #fff;
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 16px;
  text-transform: uppercase;
`;

export default TopResult;
