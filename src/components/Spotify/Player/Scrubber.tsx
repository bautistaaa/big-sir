import { ChangeEvent, FC, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { convertMsToMinutesAndSeconds } from '../../../utils';

import Slider from './Slider';

interface Props {
  playerState: Spotify.PlaybackState;
  onChange(v: number): void;
  updatePosition(v: number): void;
}
const Scrubber: FC<Props> = ({ onChange, playerState, updatePosition }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let id: number;
    if (!playerState.paused) {
      console.log(playerState);
      id = window.setInterval(() => {
        updatePosition((playerState.position += 1000));
      }, 1000);
    }
    return () => {
      clearInterval(id);
    };
  }, [updatePosition, playerState]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = +e.target.value;
    onChange(v);
  };
  return (
    <Wrapper
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <TrackProgress>
        {convertMsToMinutesAndSeconds(playerState.position)}
      </TrackProgress>
      <TrackScrubber>
        <Slider
          onChange={handleChange}
          type="range"
          min={0}
          max={playerState.duration}
          value={playerState.position}
          percentage={(playerState.position / playerState.duration) * 100}
          step={0.01}
          isActive={isActive}
        />
      </TrackScrubber>
      <TrackDuration>
        {convertMsToMinutesAndSeconds(playerState.duration)}
      </TrackDuration>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;
const TimeDisplay = styled.div`
  font-size: 11px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 16px;
  text-transform: none;
  min-width: 40px;
  text-align: center;
  color: #b3b3b3;
`;
const TrackProgress = styled(TimeDisplay)``;
const TrackScrubber = styled.div`
  height: 12px;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;
const TrackDuration = styled(TimeDisplay)``;

export default Scrubber;
