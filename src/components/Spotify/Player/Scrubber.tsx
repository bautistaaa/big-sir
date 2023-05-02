import { ChangeEvent, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { convertMsToMinutesAndSeconds } from '../../../utils';

import Slider from './Slider';

interface Props {
  playerState: Spotify.PlaybackState;
  onChange(v: number): void;
}
const Scrubber: FC<Props> = ({ onChange, playerState }) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState(playerState.position);
  const isPaused = playerState.paused;
  const playerStatePosition = playerState.position;

  useEffect(() => {
    setPosition(playerStatePosition);
  }, [playerStatePosition]);

  useEffect(() => {
    let id: number;
    if (!isPaused) {
      id = window.setInterval(() => {
        setPosition((position) => (position += 1000));
      }, 1000);
    }
    return () => {
      clearInterval(id);
    };
  }, [isPaused]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = +e.target.value;
    setPosition(v);
    onChange(v);
  };
  return (
    <Wrapper
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <TrackProgress>{convertMsToMinutesAndSeconds(position)}</TrackProgress>
      <TrackScrubber>
        <Slider
          onChange={handleChange}
          type="range"
          min={0}
          max={playerState.duration}
          value={position}
          percentage={(position / playerState.duration) * 100}
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
