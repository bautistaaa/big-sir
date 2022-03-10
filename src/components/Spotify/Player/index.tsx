import { useMachine, useActor } from '@xstate/react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import styled from 'styled-components';

import playerMachine from './player.machine';
import ClearButton from '../../ClearButton';
import RepeatIcon from '../icons/Repeat';
import ShuffleIcon from '../icons/Shuffle';
import PlayButton from '../PlayButton';
import { useSpotifyContext } from '../SpotifyContext';
import { getToken, loadSpotifyWebPlayerScript } from '../utils';
import Scrubber from './Scrubber';
import VolumeSlider from './VolumeSlider';

const Player: FC = () => {
  const token = getToken();

  const service = useSpotifyContext();
  const [, sendParent] = useActor(service);
  const [
    {
      context: { isShuffle, isMuted, volume, playerState, repeatMode },
    },
    send,
  ] = useMachine(playerMachine);
  const player = useRef<Spotify.Player | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const handleToggleMute = (value?: boolean) => {
    send({
      type: 'TOGGLE_MUTE',
      payload: { value: value ?? !isMuted },
    });
  };
  const handleVolumeChange = (volume: number) => {
    send({
      type: 'VOLUME_UPDATE',
      payload: { volume },
    });
  };
  const handleStateChange = useCallback(
    (state: Spotify.PlaybackState) => {
      send({
        type: 'PLAYER_UPDATE',
        payload: {
          state,
        },
      });
      // types out of date
      // @ts-ignore
      const linkedFromId = state?.track_window?.current_track?.linked_from?.id;
      const trackId = state?.track_window?.current_track?.id;

      sendParent({
        type: 'UPDATE_TRACK',
        payload: {
          trackId: linkedFromId ?? trackId, // this is because spotify created playlist link weird(ex: Top Songs 2021)
          track: state?.track_window?.current_track,
          isPlaying: !state?.paused,
          playlistId: state?.context?.uri?.split(':')?.[2] ?? '',
          position: state?.position,
        },
      });
    },
    [send, sendParent]
  );

  useEffect(() => {
    if (player.current) {
      if (playerState?.paused) {
        player.current?.pause();
      } else {
        player.current?.resume();
      }
    }
  }, [playerState?.paused]);

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      setScriptReady(true);
      // @ts-ignore
      window.hasBeenLoaded = true;
    };

    loadSpotifyWebPlayerScript();
    return () => {
      player.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scriptReady && !player.current) {
      if (token) {
        player.current = new Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: (cb) => {
            cb(token);
          },
        });
      }

      player.current?.addListener('ready', ({ device_id }) => {
        sendParent({ type: 'PLAYER_INIT', payload: { deviceId: device_id } });
      });

      player.current?.connect();
    }
    if (player.current) {
      player.current?.addListener('player_state_changed', handleStateChange);
      return () => {
        player.current?.removeListener(
          'player_state_changed',
          handleStateChange
        );
      };
    }
  }, [scriptReady, handleStateChange, send, sendParent, token]);

  useEffect(() => {
    // @ts-ignore
    if (window.hasBeenLoaded) {
      if (token) {
        player.current = new Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: (cb) => {
            cb(token);
          },
        });
      }

      player.current?.addListener('ready', ({ device_id }) => {
        sendParent({ type: 'PLAYER_INIT', payload: { deviceId: device_id } });
      });

      player.current?.connect();
    }
    if (player.current) {
      player.current?.addListener('player_state_changed', handleStateChange);
      return () => {
        player.current?.removeListener(
          'player_state_changed',
          handleStateChange
        );
      };
    }
  }, [token, handleStateChange, sendParent, send]);

  useEffect(() => {
    if (player.current) {
      if (isMuted) {
        player.current.setVolume(0.000001);
      } else {
        player.current.setVolume(volume);
      }
    }
  }, [volume, isMuted]);

  const handlePlayButtonClicked = () => {
    if (playerState) {
      send({
        type: 'PLAYER_UPDATE',
        payload: {
          state: {
            ...playerState,
            paused: !playerState.paused,
          },
        },
      });
    }
  };

  const handleShuffleClick = () => {
    send({ type: 'TOGGLE_SHUFFLE' });
  };

  const handleRepeatClick = async () => {
    send({ type: 'TOGGLE_REPEAT' });
  };

  const handlePreviousClick = async () => {
    try {
      await player.current?.previousTrack();
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextClick = async () => {
    try {
      await player.current?.nextTrack();
    } catch (e) {
      console.error(e);
    }
  };

  const seek = async (v: number) => {
    try {
      await player.current?.seek(v);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Wrapper>
      {playerState && (
        <>
          <LeftColumn>
            <Metadata>
              <AlbumArt
                src={
                  playerState?.track_window?.current_track?.album?.images?.[1]
                    ?.url
                }
              />
              <SongInfo>
                <Title>{playerState?.track_window?.current_track?.name}</Title>
                <Artist>
                  {playerState?.track_window?.current_track?.artists?.[0]?.name}
                </Artist>
              </SongInfo>
            </Metadata>
          </LeftColumn>
          <Controls>
            <TopRow>
              <TopRowLeft>
                <ControlButton onClick={handleShuffleClick}>
                  <ShuffleIcon enabled={isShuffle} />
                </ControlButton>
                <PrevNextButton>
                  <MdSkipPrevious
                    onClick={handlePreviousClick}
                    color="#b3b3b3"
                    size={20}
                  />
                </PrevNextButton>
              </TopRowLeft>
              <PlayButton
                onClick={handlePlayButtonClicked}
                isPlaying={!playerState.paused}
                size="medium"
                type="inverse"
              />
              <TopRowRight>
                <PrevNextButton>
                  <MdSkipNext
                    onClick={handleNextClick}
                    color="#b3b3b3"
                    size={20}
                  />
                </PrevNextButton>
                <ControlButton onClick={handleRepeatClick}>
                  <RepeatIcon mode={repeatMode} />
                </ControlButton>
              </TopRowRight>
            </TopRow>
            <BottomRow>
              <Scrubber playerState={playerState} onChange={seek} />
            </BottomRow>
          </Controls>
          <RightColumn>
            <VolumeSlider
              volume={volume}
              onChange={handleVolumeChange}
              isMuted={isMuted}
              toggleMute={handleToggleMute}
            />
          </RightColumn>
        </>
      )}
    </Wrapper>
  );
};

const Metadata = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
`;
const BaseAnchor = styled.a`
  color: #b3b3b3;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 16px;
  text-transform: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const SongInfo = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Title = styled(BaseAnchor)`
  && {
    font-size: 14px;
    color: white;
  }
`;
const Artist = styled(BaseAnchor)`
  font-size: 11px;
`;
const AlbumArt = styled.img`
  height: 56px;
  width: 56px;
  margin-right: 5px;
`;
const LeftColumn = styled.div`
  min-width: 180px;
  width: 30%;
  height: 100%;
`;
const RightColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  min-width: 180px;
  width: 30%;
`;
const TopRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 8px;
  margin-bottom: 12px;
  width: 100%;
`;
const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const BaseTopControlSection = styled.div`
  gap: 8px;
  display: flex;
  flex: 1;
`;
const TopRowLeft = styled(BaseTopControlSection)`
  justify-content: flex-end;
`;
const TopRowRight = styled(BaseTopControlSection)``;
const Controls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 722px;
  width: 40%;
`;
const ControlButton = styled(ClearButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;
const PrevNextButton = styled(ControlButton)`
  svg {
    fill: #b3b3b3;
    &:hover {
      fill: #ffffff;
    }
  }
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

export default Player;
